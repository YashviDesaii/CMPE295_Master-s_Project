from flask import Flask
import requests
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard
import torch
import torch.nn as nn
import pandas as pd
import os
from torchvision import transforms
from efficientnet_pytorch import EfficientNet
from PIL import Image
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS

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

# Model and transformations setup
num_classes = 3116
data_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

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

if __name__ == '__app__':
    app.run(debug=True)
