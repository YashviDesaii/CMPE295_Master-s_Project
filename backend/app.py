from flask import Flask
import requests
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard
import torch
import torch.nn as nn
import pandas as pd
import os
from torchvision import models, transforms
from efficientnet_pytorch import EfficientNet
from PIL import Image
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random


app = Flask(__name__)
CORS(app)


# Register blueprints if necess

app.register_blueprint(SignIn.SignIn)
app.register_blueprint(SignUp.SignUp)
app.register_blueprint(NewPoliceReport.NewPoliceReport)
app.register_blueprint(HotelIdentification.HotelIdentification)
app.register_blueprint(CaseInformation.CaseInformation)
app.register_blueprint(HotelInformation.HotelInformation)
app.register_blueprint(CrimeMapping.CrimeMapping)
app.register_blueprint(StatisticsDashboard.StatisticsDashboard)

def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

'''


# Model and transformations setup
num_classes = 3116
data_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

best_checkpoint_path = "checkpoint_epoch_20.pth"
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

best_model = EfficientNet.from_pretrained('efficientnet-b4')
num_features = best_model._fc.in_features
best_model._fc = nn.Linear(num_features, num_classes)
best_model.load_state_dict(torch.load(best_checkpoint_path))
best_model.to(device)

# Load class labels from validation.csv
validation_df = pd.read_csv('validation.csv')
class_labels = validation_df['hotel_id'].unique().tolist()

# Function to infer the image from a URL
def infer_image_from_url(url, model, transform, class_labels):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content)).convert('RGB')
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)
    model.eval()
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    predicted_label = class_labels[predicted.item()]
    return predicted_label

# API endpoint to handle the POST request
@app.route('/predict', methods=['POST'])
def predict():
    # Correct use of the request object to check the method
    if request.method == 'POST':
        try:
            # Properly get JSON data from the request
            data = request.get_json()
            image_url = data['imageUrl']
            predicted_label = infer_image_from_url(image_url, best_model, data_transform, class_labels)
            return jsonify({"predicted_label": predicted_label})
        except Exception as e:
            # Return a JSON response with the error message
            return jsonify({"error": str(e)})
'''
# Device configuration
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the class names
df1 = pd.read_csv('updated_hotel_to_imagecount_mapping.csv')
class_names = df1['hotel_id'].tolist()

# Define or import the set_seeds function
def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seeds()

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


def predict_vit(image):
    # Assuming `image` is already an Image object.
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)
    with torch.no_grad():
        output = pretrained_vit(image)
    probabilities, indices = torch.topk(output, 5)
    top_hotel_ids = [class_names[idx] for idx in indices[0]]
    top_probabilities = [prob.item() for prob in probabilities[0]]  # Convert probabilities to regular float list
    return top_hotel_ids, top_probabilities


# Flask route for ViT model predictions
@app.route('/predict', methods=['POST'])
def predict():
    print("inside predict")
    if request.method == 'POST':
        print("inside POST")
        try:
            data = request.get_json()
            print("inside try")
            print(data)
            image_url = data['imageUrl']
            print(image_url)
            response = requests.get(image_url)
            print(response.text)
            image = Image.open(BytesIO(response.content)).convert('RGB')
            top_hotel_ids, top_probabilities = predict_vit(image)
            response_data = {
                'hotelIds': top_hotel_ids,
                'probabilities': top_probabilities
            }
            return jsonify(response_data)
        except Exception as e:
            print(str(e))
            return jsonify({"error": str(e)})

if __name__ == '__app__':
    app.run(debug=True)
