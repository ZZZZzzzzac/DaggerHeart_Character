# %%
# iterate all file in this directory and if do something if is json
import os
import json



def iterate_files_in_directory(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(".json"):
                with open(os.path.join(root, filename), 'r', encoding='utf-8') as file:
                    try:
                        data = json.load(file)
                        
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON from {filename}: {e}")
                    except Exception as e:
                        print(f"An error occurred while processing {filename}: {e}")



if __name__ == "__main__":
    directory = os.path.dirname(os.path.abspath(__file__))
    iterate_files_in_directory(directory)
    print("All JSON files processed.")