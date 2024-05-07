import pandas as pd
import os
import shutil
import warnings
warnings.filterwarnings('ignore')
'''
Merge intermediate data folders to create Final Balanced image folder
Create updated hotel to image mapping csv's
'''


#Checking Augmented/Downsampled images stats
def balance_stats(destination_folder):
    image_counts_df = pd.DataFrame(columns=['hotel_id', 'image_count'])

    for root, dirs, files in os.walk(destination_folder):
        for hotel_id in dirs:
            hotel_path = os.path.join(root, hotel_id)
            image_count = len(os.listdir(hotel_path))
            image_counts_df = image_counts_df.append({'hotel_id': hotel_id, 'image_count': image_count}, ignore_index=True)

    print('Total number of images after Balancing: ', image_counts_df['image_count'].sum())
    # Display the image counts DataFrame
    print(image_counts_df.sample(10))
    print("*"*50)
    # print((image_counts_df['image_count']<5).sum())
    # for i,r in image_counts_df.iterrows():
    #     if r['image_count'] <5:
    #      print(r['hotel_id'])


#Merging Folders
def merge(folder1, folder2, outputfolder):
    folder1_path = folder1
    folder2_path = folder2
    new_folder_path = outputfolder
    if not os.path.exists(new_folder_path):
        os.makedirs(new_folder_path)

    for root, _, files in os.walk(folder1_path):
        relative_path = os.path.relpath(root, folder1_path)
        new_subdirectory = os.path.join(new_folder_path, relative_path)

        if not os.path.exists(new_subdirectory):
            os.makedirs(new_subdirectory)

        for file in files:
            file_path = os.path.join(root, file)
            shutil.copy(file_path, new_subdirectory)

    for root, _, files in os.walk(folder2_path):
        relative_path = os.path.relpath(root, folder2_path)
        new_subdirectory = os.path.join(new_folder_path, relative_path)

        if not os.path.exists(new_subdirectory):
            os.makedirs(new_subdirectory)

        for file in files:
            file_path = os.path.join(root, file)
            shutil.copy(file_path, new_subdirectory)

def create_csv(input_path):
    hotel_list = []
    for dirname, _, filenames in os.walk(input_path):
        for filename in filenames:
            hotel_list.append(os.path.join(dirname, filename))

    image_id = []
    hotel_id = []  
    for i in hotel_list:
        image_id.append(str(i.split('/')[-1]))
        hotel_id.append(str(i.split('/')[-2]))

    no_of_images_per_hotel = {val: hotel_id.count(val) for val in set(hotel_id)}

    df = pd.DataFrame(columns=['image_id','hotel_id'])

    df['image_id'] = image_id
    df['hotel_id'] = hotel_id
    df.to_csv('updated_image_to_hotel_mapping.csv',index=False)

    df2 = pd.DataFrame(columns=['hotel_id','count'])

    lisKey = []
    lisVal = []
    for key,val in no_of_images_per_hotel.items():
        lisKey.append(key)
        lisVal.append(val)
    df2['hotel_id'] = lisKey
    df2['count'] = lisVal
    df2.to_csv('updated_hotel_to_imagecount_mapping.csv',index=False)

# #Get stats for dall-e augmented image folder
# balance_stats('jpg_dalle_augmented_train_images_256x256')
# #Get stats for other augmented image folder between 5 to 15
# balance_stats('normal_augmented15_train_images_256x256')
# # #Get stats for other augmented image folder between 15 to 50
# balance_stats('normal_augmented50_train_images_256x256')
# # #Get stats for downsampled images 
# balance_stats('balanced_oversampled_train_images_256x256')


#Let's merge the 4 folders
# merge('jpg_dalle_augmented_train_images_256x256','balanced_oversampled_train_images_256x256','mergedfolder1')
# merge('normal_augmented15_train_images_256x256','normal_augmented50_train_images_256x256','mergedfolder2')
# merge('mergedfolder1','mergedfolder2','mergedfolder3')
# merge('mergedfolder3','balance_folder','final_balanced_256x256')
# balance_stats('final_balanced_256x256')


# Create updated Csv's
# create_csv('final_balanced_256x256')