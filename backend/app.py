from flask import Flask
from routes import SignIn, SignUp, NewPoliceReport, HotelIdentification, CaseInformation, HotelInformation, CrimeMapping, StatisticsDashboard
import torch
import torch.nn as nn
from torchvision import transforms
from efficientnet_pytorch import EfficientNet
from PIL import Image


app = Flask(__name__)


app.register_blueprint(SignIn.SignIn)
app.register_blueprint(SignUp.SignUp)
app.register_blueprint(NewPoliceReport.NewPoliceReport)
app.register_blueprint(HotelIdentification.HotelIdentification)
app.register_blueprint(CaseInformation.CaseInformation)
app.register_blueprint(HotelInformation.HotelInformation)
app.register_blueprint(CrimeMapping.CrimeMapping)
app.register_blueprint(StatisticsDashboard.StatisticsDashboard)


# Number of classes - replace this with the actual number of classes you have
num_classes = 3116  # Example placeholder value

# Initialize the model
model = EfficientNet.from_name('efficientnet-b4')

# Replace the final layer to match the training configuration
num_features = model._fc.in_features
model._fc = nn.Linear(num_features, num_classes)

# Load the trained weights
model.load_state_dict(torch.load('abc.pth'))
model.eval()  # Set the model to evaluation mode


transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Match the input size used during training
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_image(image_path):
    image = Image.open(image_path).convert('RGB')
    image = transform(image)
    image = image.unsqueeze(0)  # Add batch dimension
    return image

def predict(image_path):
    image = load_image(image_path)
    with torch.no_grad():  # No need to track gradients
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)  # Get the index of the max log-probability
        return predicted.item()

image_path = '000040539.jpg'
predicted_class = predict(image_path)
print(f'Predicted class: {predicted_class}')

if __name__ == '__app__':
    app.run(debug=True)
