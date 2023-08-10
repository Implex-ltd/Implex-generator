import os
import argparse
from PIL import Image

def is_valid_png(file_path):
    try:
        img = Image.open(file_path)
        return img.format == 'JPEG'
    except:
        return False

def remove_non_png_files(directory):
    removed_count = 0

    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        
        if os.path.isfile(file_path) and not is_valid_png(file_path):
            os.remove(file_path)
            removed_count += 1
            print(f'Removed: {filename}')

    print(f'Total non-PNG files removed: {removed_count}')

def main():
    parser = argparse.ArgumentParser(description='Remove non-PNG files from a directory')
    parser.add_argument('directory', help='The directory to search for non-PNG files')
    args = parser.parse_args()

    directory = args.directory
    if not os.path.isdir(directory):
        print(f"Error: '{directory}' is not a valid directory.")
        return

    remove_non_png_files(directory)

if __name__ == '__main__':
    main()
