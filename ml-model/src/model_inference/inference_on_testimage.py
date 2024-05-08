import pandas as pd
import torch
import torchvision
from torch import nn
from torchvision.transforms import transforms
from PIL import Image 
from helper_functions import set_seeds

device = "cuda" if torch.cuda.is_available() else "cpu"
print('DEVICE NAME: ', device)

# Load the trained model from the saved checkpoint
checkpoint_path = "checkpoints/checkpoint_epoch_20.pth"
pretrained_vit_weights = torchvision.models.ViT_B_16_Weights.DEFAULT
pretrained_vit = torchvision.models.vit_b_16(weights=pretrained_vit_weights).to(device)
# Freeze the base parameters
for parameter in pretrained_vit.parameters():
    parameter.requires_grad = False
    
# Change the classifier head 
df1 = pd.read_csv('/home/016690830/masterproj/notebooks/data_preprocessing/updated_hotel_to_imagecount_mapping.csv')
class_names = df1['hotel_id']

set_seeds()
pretrained_vit.heads = nn.Linear(in_features=768, out_features=len(class_names)).to(device)

state_dict = torch.load(checkpoint_path,map_location=torch.device('cpu'))['model_state_dict'] #adding maplocation for cpu

pretrained_vit.load_state_dict(state_dict)
pretrained_vit.eval()

def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],         
                            std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)  # Add batch dimension
    return image

def perform_inference(image_path, model):
    image = preprocess_image(image_path)
    with torch.no_grad():
        model.eval()
        output = model(image)
    return output.squeeze()

def get_top_k_hotel_ids(predictions, k=5):
    probabilities, indices = torch.topk(predictions, k)
    top_k_hotel_ids = [class_names[index.item()] for index in indices]
    top_k_probabilities = probabilities.tolist()
    return top_k_hotel_ids, top_k_probabilities


# Perform inference on a test image
test_image_path = '/home/016690830/masterproj/data/final/test_images/463/000029270.jpg'
predictions = perform_inference(test_image_path, pretrained_vit)

# Get top 5 hotel IDs from predictions
top_hotel_ids, top_probabilities = get_top_k_hotel_ids(predictions, k=5)

print('predictions: ', predictions, '\n')
print('top_hotel_ids : top_probabilities', top_hotel_ids, ' : ', top_probabilities)