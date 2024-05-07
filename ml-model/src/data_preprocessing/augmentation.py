import os
import numpy as np 
import pandas as pd
import random
import shutil
import matplotlib.pyplot as plt
import cv2
import requests
import time
import openai
from PIL import Image
from openai import OpenAI
''''
This script will downsample images of hotels where we have a lot of images, augment where we have less images.
Output will be a balanced dataset and an updated hotel to image mapping.
'''
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
df1 = pd.read_csv('/home/016690830/masterproj/hotel_to_imagecount_mapping.csv')


def dataset_stats():
    df1 = pd.read_csv('/home/016690830/masterproj/hotel_to_imagecount_mapping.csv')
    df2 = pd.read_csv('/home/016690830/masterproj/image_to_hotel_mapping.csv')
    s = df1['count'].sum()
    print('total number of images: ', s)
    mx= df1['count'].max()
    print('maximum number of images for a hotel: ', mx)
    mn = df1['count'].min()
    print('minimum number of images for a hotel: ', mn)
    mean = df1['count'].mean()
    print('average number of images for a hotel: ', mean)
    print('Number of hotels with count greater then 200: ',(df1['count']>=200).sum())
    print('Number of hotels with count greater then 100: ',(df1['count']>=100).sum())
    print('Number of hotels with count less than 100: ',((df1['count']<100).sum()))
    print('Number of hotels with count greater then 50, less than 100:  ', (df1['count']>50).sum()-(df1['count']>100).sum())
    print('Number of hotels with count less then 50: ',(df1['count']<=50).sum())
    print('Number of hotels with count less then 40: ',(df1['count']<=40).sum())
    print('Number of hotels with count less then 30: ',(df1['count']<=30).sum())
    print('Number of hotels with count less then 20: ',(df1['count']<=20).sum())
    print('Number of hotels with count less then 15: ',(df1['count']<=15).sum())
    print('Number of hotels with count less then 10: ',(df1['count']<=10).sum())
    print('Number of hotels with count less then 5: ',(df1['count']<=5).sum())
    print('Number of hotels with count equal to 1: ',(df1['count']==1).sum())

'''
Hotels with over 200 Images: Downsample to 200 images per hotel to prevent large imbalances.
Hotels with 100-200 Images: Leave these hotels as they are since they are relatively balanced.
Hotels with 50-100 Images: Leave these hotels unchanged as well, maintaining their current image counts.
Hotels with 15-50 Images: Augment these hotels to reach 50 images per hotel, helping to improve the model's performance on these hotels.
Hotels with 5-15 Images: Augment these hotels to reach 15 images per hotel.
Hotels with less than 5 Images: Augment using DALL-E
This approach aims to balance the dataset by adjusting the image counts for hotels with extreme values while leaving moderately balanced hotels unchanged. 
Augmenting hotels with fewer images can help improve model performance and generalization.
'''
def visualize(filepath,output_image):
    # Read the CSV file into a DataFrame
    df1 = pd.read_csv(filepath)

    # Calculate the image count buckets
    image_counts = df1['count']
    buckets = [0,5,10,15, 20, 30, 40, 50, 100, 200, 500, 1000, float('inf')]
    bucket_labels = ['Under 5','5-9', '10-14', '15-19', '20-29', '30-39', '40-49', '50-99', '100-199', '200-499', '500-999', '1000+']
    
    # Count the number of hotels in each bucket
    bucket_counts = pd.cut(image_counts, bins=buckets, labels=bucket_labels, right=False).value_counts().sort_index()

    # Plotting the histogram
    plt.figure(figsize=(12, 6))

    # Subplot for histogram
    plt.subplot(1, 2, 1)
    bars = plt.bar(bucket_counts.index, bucket_counts.values, color='skyblue')
    plt.xlabel('Number of Images per Hotel Bucket')
    plt.ylabel('Number of Hotels')
    plt.title('Distribution of Hotels by Number of Images')
    plt.xticks(rotation=45)

    # Add text annotations (number of images per hotel) on top of each bar
    for bar, count in zip(bars, bucket_counts.values):
        plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 5, f'{count}', ha='center', va='bottom')

    # Subplot for pie chart
    plt.subplot(1, 2, 2)
    explode = [0.1] * len(bucket_counts)
    plt.pie(bucket_counts.values, labels=bucket_counts.index, autopct='%1.1f%%', explode=explode, startangle=140)
    plt.title('Distribution of Hotels by Number of Images (Pie Chart)')
    plt.tight_layout()
    plt.savefig(output_image)

def create_png():
    # Define source and destination paths
    source_dir_jpg = '../../data/resized/resized_train_images_256'
    destination_dir_png = '../../data/resized/png_images_256'

    # Create the destination directory if it doesn't exist
    os.makedirs(destination_dir_png, exist_ok=True)

    #Function to convert .jpg images to .png for hotels with less than 15 images
    def convert_jpg_to_png(df, source_dir, destination_dir, count_threshold=15):
        hotel_ids_less_than_threshold = df[df['count'] < count_threshold]['hotel_id'].tolist()
        
        for hotel_id in hotel_ids_less_than_threshold:
            hotel_dir = os.path.join(source_dir, str(hotel_id))
            png_hotel_dir = os.path.join(destination_dir, str(hotel_id))
            os.makedirs(png_hotel_dir, exist_ok=True)
            
            for filename in os.listdir(hotel_dir):
                if filename.endswith('.jpg'):
                    img_path = os.path.join(hotel_dir, filename)
                    img = Image.open(img_path)
                    png_path = os.path.join(png_hotel_dir, os.path.splitext(filename)[0] + '.png')
                    img.save(png_path)
                    print(f"Converted {img_path} to {png_path}")

    # Call the function to convert .jpg images to .png for hotels with less than 15 images
    convert_jpg_to_png(df1, source_dir_jpg, destination_dir_png, count_threshold=15)

def resize_and_convert_to_jpg(input_folder, output_folder, target_size=(256, 256)):
    # Create the destination directory if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        print('filename: ', filename)
        for file in os.listdir(os.path.join(input_folder,filename)):
            print('file: ', file)
            if file.endswith(".png"):
                print('inside first if condition')
                input_path = os.path.join(input_folder, os.path.join(filename,file))
                output_hotel = os.path.join(output_folder,filename)
                if not os.path.exists(output_hotel):
                    os.makedirs(output_hotel)
                output_path = os.path.join(output_hotel,file.replace(".png", ".jpg"))
                # Open the image and check size
                img = Image.open(input_path)
                if img.size == target_size:
                    print('inside second if condition')
                    print(f"Image {filename} is already {target_size}, skipping resize")
                    img.convert("RGB").save(output_path, "JPEG")
                    print(f"Image {filename} resized and converted to JPG.")
                else:
                    # Resize and convert if not already 256x256
                    print('inside else condition')
                    img = img.resize(target_size)
                    img.convert("RGB").save(output_path, "JPEG")
                    print(f"Image {filename} resized and converted to JPG.")

def create_list1(path):
    # Get list of hotel IDs
    hotel_id_list = df1['hotel_id'].tolist()

    count = 0
    minority_image_list1, minority_images_label1 = [], []

    for hotel_id in hotel_id_list:
        # Get count for current hotel ID
        val = df1[df1['hotel_id'] == hotel_id]['count'].values[0]

        if val < 5:
            count += 1
            path_min = os.path.join(path, str(hotel_id))
            
            for filename in os.listdir(path_min):
                minority_image_list1.append(os.path.join(path_min, filename))
                minority_images_label1.append(hotel_id)

    return  minority_image_list1, minority_images_label1

def create_list2(path,range_start,range_end):
    # Get list of hotel IDs
    hotel_id_list = df1['hotel_id'].tolist()

    count = 0
    minority_image_list2, minority_images_label2 = [], []

    for hotel_id in hotel_id_list:
        # Get count for current hotel ID
        val = df1[df1['hotel_id'] == hotel_id]['count'].values[0]

        if val > range_start and val<range_end:
            count += 1
            path_min = os.path.join(path, str(hotel_id))
            
            for filename in os.listdir(path_min):
                minority_image_list2.append(os.path.join(path_min, filename))
                minority_images_label2.append(hotel_id)

    return  minority_image_list2, minority_images_label2 

def create_list3(path):
    # Get list of hotel IDs
    hotel_id_list = df1['hotel_id'].tolist()

    count = 0
    image_list, images_label = [], []

    for hotel_id in hotel_id_list:
        # Get count for current hotel ID
        val = df1[df1['hotel_id'] == hotel_id]['count'].values[0]

        if val in [5,15] or (val >=50 and val <=200):
            count += 1
            path_min = os.path.join(path, str(hotel_id))
            
            for filename in os.listdir(path_min):
                image_list.append(os.path.join(path_min, filename))
                images_label.append(hotel_id)

    return  image_list, images_label

def rotate(image):
    angle = random.randint(-20, 20)
    height, width = image.shape[:2]
    matrix = cv2.getRotationMatrix2D((width/2, height/2), angle, 1)
    rotated_image = cv2.warpAffine(image, matrix, (width, height))
    return rotated_image

def flip(image):
    flip_code = random.randint(-1, 1)
    if flip_code == 0:
        flipped_image = cv2.flip(image, 1) #horizontal flip
    # elif flip_code == 1:
    #     flipped_image = cv2.flip(image, 0) #vertical flip
    else:
        flipped_image = image
    return flipped_image

def optical_distortion(image):
    height, width = image.shape[:2]
    fx = random.uniform(0.8, 1.2)
    fy = random.uniform(0.8, 1.2)
    cx = width/2
    cy = height/2
    k1 = random.uniform(-0.05, 0.05)
    k2 = random.uniform(-0.05, 0.05)
    k3 = random.uniform(-0.05, 0.05)
    p1 = random.uniform(-0.03, 0.03)
    p2 = random.uniform(-0.03, 0.03)
    distCoeffs = cv2.UMat(np.array([k1, k2, p1, p2, k3]))
    camera_matrix = np.array([[fx*width, 0, cx],
                              [0, fy*height, cy],
                              [0, 0, 1]], dtype=np.float32)
    distorted_image = cv2.undistort(image, camera_matrix, distCoeffs, None)
    return distorted_image

def gaussian_blur(image):
    kernel_size = random.choice([3, 5, 7])  # Randomly choose kernel size
    blurred_image = cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)
    return blurred_image

def color_jitter(image):
    brightness_factor = random.uniform(0.7, 1.3)
    contrast_factor = random.uniform(0.7, 1.3)
    saturation_factor = random.uniform(0.7, 1.3)

    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    hsv_image[:, :, 2] = hsv_image[:, :, 2] * brightness_factor
    hsv_image[:, :, 1] = hsv_image[:, :, 1] * contrast_factor
    hsv_image[:, :, 0] = hsv_image[:, :, 0] * saturation_factor

    augmented_image = cv2.cvtColor(hsv_image, cv2.COLOR_HSV2BGR)
    return augmented_image

# Function to create DALL·E 2 image variations with retry logic for rate limit error
def create_dalle_variations_retry(input_image_path, output_folder, variations=3, size="1024x1024", retry_count=3):
    try:
        response = client.images.create_variation(
            model="dall-e-2",
            image=open(input_image_path, "rb"),
            n=variations,
            size=size
        )

        image_urls = [item.url for item in response.data]

        # Download and save each image locally
        for i, url in enumerate(image_urls):
            image_data = requests.get(url).content
            name = input_image_path.split('/')[-1].split('.')[0]
            output_path = os.path.join(output_folder, f"{name}_dalleaugment_{i+1}.png")
            with open(output_path, "wb") as f:
                f.write(image_data)
            print(f"DALL·E image {i+1} saved as '{output_path}' locally.")
    except openai.RateLimitError as e:  # Handle RateLimitError correctly
        print("Rate limit exceeded. Waiting and retrying...")
        time.sleep(60)  # Wait for a minute
        if retry_count > 0:
            print('Retrying for : ',input_image_path,' .... ' ,output_folder)
            create_dalle_variations_retry(input_image_path, output_folder, variations, size, retry_count - 1)
        else:
            print("Retry limit reached. Exiting.")


 #Function to augment images for minority classes
def augment_images(minority_image_list, minority_images_label, output_path, max_augmentations=None):
    transformations = [rotate, flip, optical_distortion, gaussian_blur, color_jitter]
    hotel_dalle_variations = {} 
    processed_files_file = 'dall-e_processed.txt'
    processed_files = []
    # Load the names of already processed files if the processed files list exists
    if os.path.exists(processed_files_file):
        with open(processed_files_file, "r") as file:
            processed_files = file.read().splitlines()

    for hotel_id in set(minority_images_label):
        hotel_images = [img for img, label in zip(minority_image_list, minority_images_label) if label == hotel_id]
        original_image_count = len(hotel_images)
        augmentation_factor = max_augmentations - original_image_count
        hotel_path = os.path.join(output_path, str(hotel_id))

        if not os.path.exists(hotel_path):
            os.makedirs(hotel_path)

        # Check if the hotel has already been processed
        if hotel_path in processed_files:
            print(f"Skipping {hotel_path} as hotel has already been processed")
            continue  # Skip processing this file and move to the next one

        for image_path in hotel_images:
            shutil.copy2(image_path, hotel_path)

      # Apply DALL·E 2 variation for hotels with less than 15 images
        if original_image_count < 5:
            dalle_augmentations = original_image_count # Get current DALL·E augmentations count
            print('start: dalle augmentation count: ', dalle_augmentations)
            while dalle_augmentations <= 5:
                create_dalle_variations_retry(random.choice(hotel_images), hotel_path, variations=3, size="1024x1024")
                dalle_augmentations += 3  # Each DALL·E variation adds 3 images
                augmentation_factor -= 3
            hotel_dalle_variations[hotel_id] = dalle_augmentations  # Update DALL·E augmentations count
            # Add the processed hotel to the list of processed files
            processed_files.append(hotel_path)
            # Write the list of processed files to the processed files file
            with open(processed_files_file, "a") as file:
                file.write(f"{hotel_path}\n")

        elif 5 < original_image_count < 15:
            while augmentation_factor > 0:
                image_path = random.choice(hotel_images)
                img = cv2.imread(image_path)
                chosen_transformation = random.choice(transformations)
                transformed_image = chosen_transformation(img)

                full_image_name = image_path.split("/")[-1]
                image_name, file_extension = os.path.splitext(full_image_name)
                new_image_name = "{}_augmented_{}{}".format(image_name, original_image_count + 1, file_extension)

                cv2.imwrite(os.path.join(hotel_path, new_image_name), transformed_image)

                augmentation_factor -= 1
                original_image_count += 1
                
        elif 15 < original_image_count < 50:
            while augmentation_factor > 0:
                image_path = random.choice(hotel_images)
                img = cv2.imread(image_path)
                chosen_transformation = random.choice(transformations)
                transformed_image = chosen_transformation(img)

                full_image_name = image_path.split("/")[-1]
                image_name, file_extension = os.path.splitext(full_image_name)
                new_image_name = "{}_augmented_{}{}".format(image_name, original_image_count + 1, file_extension)

                cv2.imwrite(os.path.join(hotel_path, new_image_name), transformed_image)

                augmentation_factor -= 1
                original_image_count += 1


def balance_transfer(image_list, images_label, output_path):
    #transfer folders where hotels have image_count 5,15,50
    for hotel_id in set(images_label):
        hotel_images = [img for img, label in zip(image_list, images_label) if label == hotel_id]
        hotel_path = os.path.join(output_path, str(hotel_id))

        if not os.path.exists(hotel_path):
            os.makedirs(hotel_path)

        for image_path in hotel_images:
            shutil.copy2(image_path, hotel_path)


# create_png()
# dataset_stats()
# visualize('/home/016690830/masterproj/hotel_to_imagecount_mapping.csv','image_buckets.png')

# Create lists of minority images based on specified criteria
# minority_image_list1, minority_images_label1 = create_list1('../../data/resized/png_images_256/')
# minority_image_list2, minority_images_label2  = create_list2('../../data/resized/resized_train_images_256',5,15)
# minority_image_list3, minority_images_label3  = create_list2('../../data/resized/resized_train_images_256',15,50)
# print(minority_image_list1[:10])
# print(minority_image_list2[:10])
# print(minority_image_list3[:10])

# Augment images for hotels with less than 5 images and apply DALL·E 2 variation
# augment_images(minority_image_list1, minority_images_label1, 'dalle_augmented_train_images_256x256',5)

# Augment images for hotels between 5 to 15
# augment_images(minority_image_list2, minority_images_label2, 'normal_augmented15_train_images_256x256',15)

# Augment images for hotels with 15 to 50 images using other transformations
# augment_images(minority_image_list3, minority_images_label3, 'normal_augmented50_train_images_256x256',50)


# resize_and_convert_to_jpg('dalle_augmented_train_images_256x256', 'jpg_dalle_augmented_train_images_256x256')

# image_list, images_label  = create_list3('../../data/resized/resized_train_images_256')
# balance_transfer(image_list, images_label, 'balance_folder')