from flask import Flask, request, jsonify
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard
import torch
import torch.nn as nn
import pandas as pd
import os
from torchvision import transforms
from efficientnet_pytorch import EfficientNet
from PIL import Image
import requests

app = Flask(__name__)

# Register blueprints
app.register_blueprint(SignIn.SignIn)
app.register_blueprint(SignUp.SignUp)
app.register_blueprint(NewPoliceReport.NewPoliceReport)
app.register_blueprint(HotelIdentification.HotelIdentification)
app.register_blueprint(CaseInformation.CaseInformation)
app.register_blueprint(HotelInformation.HotelInformation)
app.register_blueprint(CrimeMapping.CrimeMapping)
app.register_blueprint(StatisticsDashboard.StatisticsDashboard)

num_classes = 3116

# Define data transformation
data_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load best model
best_checkpoint_path = "abc.pth"
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

best_model = EfficientNet.from_pretrained('efficientnet-b4')
num_features = best_model._fc.in_features
best_model._fc = nn.Linear(num_features, num_classes)
best_model.load_state_dict(torch.load(best_checkpoint_path))
best_model.to(device)

# Load class labels from validation.csv
validation_df = pd.read_csv('validation.csv')
class_labels = validation_df['hotel_id'].unique().tolist()

@app.route('/predict_label', methods=['POST'])
def predict_label():
    # Get data from POST request
    data = request.json
    
    # Extract image URL from data
    image_url = data.get('imageUrl')
    
    # Download image from URL
    image_path = 'temp_image.jpg'
    try:
        response = requests.get(image_url)
        with open(image_path, 'wb') as f:
            f.write(response.content)
    except Exception as e:
        return jsonify({'error': 'Failed to download image from URL'}), 400
    
    # Perform inference
    predicted_label = infer_single_image(image_path, best_model, data_transform, class_labels)
    
    # Remove temporary image file
    os.remove(image_path)
    
    return jsonify({'predicted_label': predicted_label}), 200

def infer_single_image(image_path, model, transform, class_labels):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)
    model.eval()
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    predicted_label = class_labels[predicted.item()]
    return predicted_label

if __name__ == '__main__':
    app.run(debug=True)
