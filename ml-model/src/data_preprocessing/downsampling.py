import pandas as pd
import os
import shutil

# df1 is the DataFrame containing columns 'hotel_id' and 'count'
# df2 is the DataFrame containing columns 'image_id' and 'hotel_id'
def sample(path1,path2):
    source_folder = '../../data/resized/resized_train_images_256'
    df1 = pd.read_csv(path1)
    df2 = pd.read_csv(path2)
    # Identify hotel_id classes with a count higher than 200
    threshold = 200
    classes_to_undersample = df1[df1['count'] > threshold]['hotel_id'].tolist()

    final_df = pd.DataFrame(columns=['image_id', 'hotel_id'])

    for hotel_id in classes_to_undersample:
        class_df = df2[df2['hotel_id'] == hotel_id].sample(n=threshold, random_state=42)
        final_df = pd.concat([final_df, class_df])
        
    destination_folder = 'balanced_oversampled_train_images_256x256'
    os.makedirs(destination_folder, exist_ok=True)

    for _, row in final_df.iterrows():
        hotel_id = row['hotel_id']
        image_id = row['image_id']
        
        # Create the hotel_id folder if it doesn't exist
        hotel_path = os.path.join(destination_folder, str(hotel_id))
        if not os.path.exists(hotel_path):
            os.makedirs(hotel_path)
            
        source_path = os.path.join(source_folder, str(hotel_id), str(image_id))
        destination_path = os.path.join(hotel_path, str(image_id))
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)

        # copy the image from source to destination
        try:
            shutil.copy(source_path, destination_path)
        except FileNotFoundError:
            print("Warning: File not found {}".format(source_path))
            continue


sample('/home/016690830/masterproj/hotel_to_imagecount_mapping.csv','/home/016690830/masterproj/image_to_hotel_mapping.csv')