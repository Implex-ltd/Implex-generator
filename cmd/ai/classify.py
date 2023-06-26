import os, shutil, hashlib
from pathlib import Path

import hcaptcha_challenger as solver

solver.install()

hashlist = {
    'xx': [
        "hash one",
        'hash two'
    ]
}

def load_hash():
    for lines in open('./hash.csv', 'r+').read().splitlines():
        try:
            if ',' not in lines:
                continue

            hash, prompt = lines.split(',')

            if prompt not in hashlist:
                hashlist[prompt] = []

            hashlist[prompt].append(hash)
        except:
            pass

def remove_duplicate_images(folder_path):
    image_hashes = {}

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if os.path.isfile(file_path) and any(file_path.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
            with open(file_path, 'rb') as f:
                image_hash = hashlib.md5(f.read()).hexdigest()

            if image_hash in image_hashes:
                os.remove(file_path)
                print(f"Removed duplicate image: {file_path}")
            else:
                image_hashes[image_hash] = file_path

def move_file(source_file, destination_folder):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    
    destination_path = os.path.join(destination_folder, os.path.basename(source_file))
    shutil.move(source_file, destination_path)
    print(f"File moved to: {destination_path}")

def bytedance(dir_datas, prompt, out):
    if prompt not in hashlist:
        hashlist[prompt] = []

    images = [
        open(Path(__file__).parent.joinpath(f"{dir_datas}/{fn}"), "rb").read()
        for fn in os.listdir(Path(__file__).parent.joinpath(dir_datas))
    ]

    challenger = solver.new_challenger()
    if result := challenger.classify(prompt=prompt, images=images):
        for i, fp in enumerate(os.listdir(Path(__file__).parent.joinpath(dir_datas))):
            print(result[i], os.path.basename(fp))

            if result[i]:
                hashlist[prompt].append(hash)

                with open(f"imgs/{os.path.basename(fp)}", 'rb') as f:
                    image_hash = hashlib.md5(f.read()).hexdigest()
                    with open('./hash.csv', 'a+') as ff:
                        ff.write(f'{image_hash},{prompt}\n')

                move_file(f"imgs/{os.path.basename(fp)}", f"classified/{out}")


if __name__ == "__main__":
    load_hash()
    while True:
        remove_duplicate_images("imgs")
        
        # or take it from .yaml
        for prompt, folder in {
            "Please click on all images containing a something you can drink": "something you can drink",
            "Please click on all images containing a hedgehog": "hedgehog",
            "Please click on all images containing a bat": "bat",
            "Please click on all images containing a food": "food",
            "Please click on all images containing a lion": "lion",
            "Please click on all images containing a building": "building",
            "Please click on all images containing a flower": "flower",
            "Please click on all images containing a rabbit": "rabbit",
            "Please click on all images containing a giraffe": "giraffe",
            "Please click on all images containing a plant": "plant",
            "Please click each image containing a penguin": "penguin",
             "Please click each image containing a car": "car",
            "Please click each image containing a cow": "cow",
            "Please click on all images containing an animal": "animal",
             "Please click each image containing a raccoon": "raccoon",
            "Please click on all images containing an animal wearing glasses": "wearing glasses",
            "Please click each image containing something you can eat": "something you can eat",
            "Please click each image containing a toy": "toy",
            "Please click on all images containing a fruit": "fruit",
            "Please click each image containing a musical instrument": "musical instrument",
        }.items():
            try:
                remove_duplicate_images(f"classified/{folder.replace(' ', '_')}")
            except:
                pass
            bytedance("imgs", prompt, folder.replace(' ', '_'))