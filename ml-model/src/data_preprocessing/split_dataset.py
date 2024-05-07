import os
import random
import shutil
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

'''
Given the distribution of images per hotel, we do stratified split to maintain \
the hotel-to-image distribution in our train, test, and validation sets. 
'''
df1 = pd.read_csv('updated_hotel_to_imagecount_mapping.csv')
s = df1['count'].sum()
print('total number of images: ', s)
mx= df1['count'].max()
print('maximum number of images for a hotel: ', mx)
mn = df1['count'].min()
print('minimum number of images for a hotel: ', mn)
mean = df1['count'].mean()


def visualize(filepath,output_image):
    # Read the CSV file into a DataFrame
    df1 = pd.read_csv(filepath)

    # Calculate the image count buckets
    image_counts = df1['count']
    buckets = [5, 15, 50, 100, 200, float('inf')]
    bucket_labels = ['5-15', '15-49','50-99', '100-199', '200']
    
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

def create_train_test(csv_path, output_folder, source_folder, val_size=0.15, test_size=0.15, random_state=42):
    # Create final folder to store train, test, and validation folders
    final_path = os.path.join(output_folder,'final')
    os.makedirs(final_path, exist_ok=True)

    # Destination folders for train, test, and validation images
    train_folder = os.path.join(final_path,'train_images')
    test_folder = os.path.join(final_path,'test_images')
    validation_folder = os.path.join(final_path,'validation_images')

    # Create the destination folders if they don't exist
    os.makedirs(train_folder, exist_ok=True)
    os.makedirs(test_folder, exist_ok=True)
    os.makedirs(validation_folder, exist_ok=True)
    
    df = pd.read_csv(csv_path)
    df_shuffled = df.sample(frac=1, random_state=random_state)

    # Calculate the number of instances for each class
    class_counts = df_shuffled['hotel_id'].value_counts()

    # Initialize lists to store indices for train, validation, and test sets
    train_indices = []
    val_indices = []
    test_indices = []

    for hotel_id, count in class_counts.items():
        # Get indices for instances of this hotel_id
        hotel_indices = df_shuffled[df_shuffled['hotel_id'] == hotel_id].index.tolist()
        
        # Calculate minimum split sizes for validation and test sets
        min_val_size_class = 1
        min_test_size_class = 1

        # Calculate split sizes based on class count
        val_size_class = max(min_val_size_class, int(count * val_size))
        test_size_class = max(min_test_size_class, int(count * test_size))

        # Assign indices to validation and test sets
        val_indices.extend(hotel_indices[:val_size_class])
        test_indices.extend(hotel_indices[val_size_class:val_size_class + test_size_class])
        
        # The remaining instances go to the training set
        train_indices.extend(hotel_indices[val_size_class + test_size_class:])

    # Create DataFrame subsets for train, validation, and test sets
    train_df = df_shuffled.loc[train_indices]
    val_df = df_shuffled.loc[val_indices]
    test_df = df_shuffled.loc[test_indices]

    # Create hotel_id subfolders within train, validation, and test folders
    for hotel_id in train_df['hotel_id'].unique():
        os.makedirs(os.path.join(train_folder, str(hotel_id)), exist_ok=True)

    for hotel_id in val_df['hotel_id'].unique():
        os.makedirs(os.path.join(validation_folder, str(hotel_id)), exist_ok=True)

    for hotel_id in test_df['hotel_id'].unique():
        os.makedirs(os.path.join(test_folder, str(hotel_id)), exist_ok=True)

    # Move images to train folder
    for index, row in train_df.iterrows():
        image_id = row['image_id']
        hotel_id = row['hotel_id']
        source_path = os.path.join(source_folder, str(hotel_id), f"{image_id}")
        target_path = os.path.join(train_folder, str(hotel_id), f"{image_id}")
        shutil.copyfile(source_path, target_path)

    # Move images to validation folder
    for index, row in val_df.iterrows():
        image_id = row['image_id']
        hotel_id = row['hotel_id']
        source_path = os.path.join(source_folder, str(hotel_id), f"{image_id}")
        target_path = os.path.join(validation_folder, str(hotel_id), f"{image_id}")
        shutil.copyfile(source_path, target_path)

    # Move images to test folder
    for index, row in test_df.iterrows():
        image_id = row['image_id']
        hotel_id = row['hotel_id']
        source_path = os.path.join(source_folder, str(hotel_id), f"{image_id}")
        target_path = os.path.join(test_folder, str(hotel_id), f"{image_id}")
        shutil.copyfile(source_path, target_path)

    return train_df, val_df, test_df

# visualize('updated_hotel_to_imagecount_mapping.csv','updated_image_buckets.png')
train_df, val_df, test_df = create_train_test('updated_image_to_hotel_mapping.csv','../../data/','final_balanced_256x256')
print(len(set(test_df['hotel_id'])))
print(len(set(val_df['hotel_id'])))
print(len(set(train_df['hotel_id'])))

