from flask import Flask, request, jsonify
import requests
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard
import torch
import torch.nn as nn
import torch.nn.functional as F
import pandas as pd
import os
from torchvision import models, transforms
from efficientnet_pytorch import EfficientNet
from PIL import Image
from io import BytesIO
from flask_cors import CORS
import numpy as np
import random
import logging
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(SignIn.SignIn)
app.register_blueprint(SignUp.SignUp)
app.register_blueprint(NewPoliceReport.NewPoliceReport)
app.register_blueprint(HotelIdentification.HotelIdentification)
app.register_blueprint(CaseInformation.CaseInformation)
app.register_blueprint(HotelInformation.HotelInformation)
app.register_blueprint(CrimeMapping.CrimeMapping)
app.register_blueprint(StatisticsDashboard.StatisticsDashboard)

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set seeds for reproducibility
def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seeds()

# Device configuration
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Load the class names
df1 = pd.read_csv('updated_hotel_to_imagecount_mapping.csv')
class_names = df1['hotel_id'].tolist()

# Set up the Vision Transformer model
pretrained_vit = models.vit_b_16(weights=models.ViT_B_16_Weights.DEFAULT).to(device)
pretrained_vit.heads = nn.Linear(in_features=768, out_features=len(class_names)).to(device)
for parameter in pretrained_vit.parameters():
    parameter.requires_grad = False

# Load the model state
vit_checkpoint_path = "checkpoint_epoch_20.pth"
vit_state_dict = torch.load(vit_checkpoint_path, map_location=torch.device(device))['model_state_dict']
pretrained_vit.load_state_dict(vit_state_dict)
pretrained_vit.eval()

# Transform function for image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def predict_vit(image):
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)
    with torch.no_grad():
        output = pretrained_vit(image)
        probabilities = F.softmax(output, dim=1)  # Apply softmax to get probabilities
    top_probabilities, indices = torch.topk(probabilities, 5)
    top_hotel_ids = [class_names[idx] for idx in indices[0]]
    top_probabilities = [prob.item() * 100 for prob in top_probabilities[0]]  # Convert probabilities to regular float list
    return top_hotel_ids, top_probabilities

# API endpoint to handle the POST request
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data or 'imageUrl' not in data:
                raise ValueError("Missing 'imageUrl' in the request data.")
            
            image_url = data['imageUrl']
            if not is_valid_url(image_url):
                raise ValueError("Invalid URL provided.")
            
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert('RGB')
            top_hotel_ids, top_probabilities = predict_vit(image)
            response_data = {
                'hotelIds': top_hotel_ids,
                'probabilities': top_probabilities
            }
            return jsonify(response_data), 200
        except ValueError as e:
            logger.error(f"ValueError: {str(e)}")
            return jsonify({"error": str(e)}), 400
        except requests.RequestException as e:
            logger.error(f"RequestException: {str(e)}")
            return jsonify({"error": f"Failed to fetch the image from URL: {str(e)}"}), 400
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return jsonify({"error": "An unexpected error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True)
