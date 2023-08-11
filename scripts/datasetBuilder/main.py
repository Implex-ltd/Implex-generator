import argparse, os, sys, onnxruntime, shutil, time, threading
from PIL import Image
from tqdm import tqdm
import numpy as np


class Io:
    @staticmethod
    def ensure_directory_exists(directory):
        if not os.path.exists(directory):
            os.makedirs(directory)

    @staticmethod
    def is_valid_png(file_path):
        try:
            img = Image.open(file_path)
            return img.format == "JPEG"
        except:
            return False

    @staticmethod
    def remove_non_png_files():
        directory = "input/unlabeled"
        rm = 0

        for filename in tqdm(
            os.listdir(directory), desc="Removing non-PNG files", unit="file"
        ):
            file_path = os.path.join(directory, filename)

            if os.path.isfile(file_path) and not Io.is_valid_png(file_path):
                os.remove(file_path)
                rm += 1

        print(f"Total non-PNG files removed: {rm}")


class Parser(threading.Thread):
    def __init__(self, model_path):
        self.session = onnxruntime.InferenceSession(model_path)
        self.model_path = model_path

        threading.Thread.__init__(self)

    def preprocess_image(self, image_path):
        image = Image.open(image_path)
        image = image.resize((64, 64))
        image = np.array(image).astype(np.float32)
        image = np.transpose(image, (2, 0, 1))
        image /= 255.0
        image = np.expand_dims(image, axis=0)

        return image

    def determine(self, image_path):
        input_image = self.preprocess_image(image_path)

        input_name = self.session.get_inputs()[0].name
        output_name = self.session.get_outputs()[0].name
        output = self.session.run([output_name], {input_name: input_image})

        class_index = np.argmax(output[0])

        if class_index == 0:
            return True
        else:
            return False

    def run(self):
        print(f"Indexing {self.model_path}")

        base_path = "./input/unlabeled"
        task = self.model_path.split("models/")[1].split(".")[0]
        good, bad = 0, 0

        Io.ensure_directory_exists(f"./output/{task}")
        Io.ensure_directory_exists(f"./output/{task}/yes/")
        Io.ensure_directory_exists(f"./output/{task}/bad/")

        start = time.time()
        for image in os.listdir(base_path):
            try:
                if self.determine(f"{base_path}/{image}") is True:
                    shutil.copy(f"{base_path}/{image}", f"./output/{task}/yes/{image}")
                    good += 1
                else:
                    shutil.copy(f"{base_path}/{image}", f"./output/{task}/bad/{image}")
                    bad += 1
            except Exception as e:
                print(e)
                os.remove(f"{base_path}/{image}")

        end = time.time()
        print(
            f"It took {round(end - start, 1)}s to determine that there are {good} {task}s and {bad} not {task}s"
        )


class Sorter(threading.Thread):
    def __init__(self, current, models):
        self.current = current
        self.models = models

        self.yes = []

        threading.Thread.__init__(self)

    def check_no_folder(self, model):
        model = model.split(".")[0]

        for filename in os.listdir(f"./output/{model}/bad"):
            if filename in self.yes:
                try:
                    os.remove(f"./output/{model}/bad/{filename}")
                    print(f"Deleted yes {model} -> {filename}")
                except:
                    pass

    def run(self):
        task = self.current.split(".")[0]

        yes_directory = f"./output/{task}/yes"
        for filename in os.listdir(yes_directory):
            self.yes.append(filename)

        print(f"Loaded {len(self.yes)} {task} images")

        for model in self.models:
            threading.Thread(target=self.check_no_folder, args=[model]).start()

# parser copy, need to clean
class Indexor(threading.Thread):
    def __init__(self, model_path, dataset):
        try:
            self.session = onnxruntime.InferenceSession(model_path)
        except:
            self.session = None

        self.model_path = model_path
        self.dataset = dataset

        threading.Thread.__init__(self)

    def preprocess_image(self, image_path):
        image = Image.open(image_path)
        image = image.resize((64, 64))
        image = np.array(image).astype(np.float32)
        image = np.transpose(image, (2, 0, 1))
        image /= 255.0
        image = np.expand_dims(image, axis=0)

        return image

    def determine(self, image_path):
        input_image = self.preprocess_image(image_path)

        input_name = self.session.get_inputs()[0].name
        output_name = self.session.get_outputs()[0].name
        output = self.session.run([output_name], {input_name: input_image})

        class_index = np.argmax(output[0])

        if class_index == 0:
            return True
        else:
            return False

    def run(self):
        if self.session == None:
            return
        
        print(f"Indexing {self.model_path} -> {self.dataset}")

        base_path = self.dataset
        task = self.model_path.split("models/")[1].split(".")[0]
        good, bad = 0, 0

        Io.ensure_directory_exists(f"./output/{task}")
        Io.ensure_directory_exists(f"./output/{task}/yes/")
        Io.ensure_directory_exists(f"./output/{task}/bad/")

        start = time.time()
        for image in os.listdir(base_path):
            try:
                if self.determine(f"{base_path}/{image}") is True:
                    shutil.copy(f"{base_path}/{image}", f"./output/{task}/yes/{image}")
                    good += 1
                else:
                    shutil.copy(f"{base_path}/{image}", f"./output/{task}/bad/{image}")
                    bad += 1
            except Exception as e:
                print(e)
                os.remove(f"{base_path}/{image}")

        end = time.time()
        print(
            f"It took {round(end - start, 1)}s to determine that there are {good} {task}s and {bad} not {task}s"
        )


# py main.py train --task='flower' --epochs 200
if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Implex's AI Factory")
    p.add_argument(
        "-c", dest="clean", action="store_true", help="remove invalid jpeg files"
    )
    p.add_argument(
        "-p",
        dest="parse",
        action="store_true",
        help="labelise onnx models and sort imgs from unlabeled (bad/yes)",
    )
    p.add_argument(
        "-l",
        dest="labelise",
        action="store_true",
        help="labelise onnx models and sort imgs from scraper (bad/yes)",
    )
    p.add_argument(
        "-s",
        dest="sort",
        action="store_true",
        help="sort parsed unlabeled dataset (make your dataset better)",
    )
    args = p.parse_args()

    if len(sys.argv) == 1:
        p.print_usage()

    if args.clean:
        Io.remove_non_png_files()

    if args.parse:
        for model in os.listdir("./input/models"):
            Parser(f"./input/models/{model}").start()

    if args.sort:
        models = os.listdir("./input/models")

        for model in models:
            Sorter(model, models).start()


    if args.labelise:
        for prompt in os.listdir("./input/scrapper"):
            model = prompt.split('_a_')[1]
            Indexor(f"./input/models/{model}.onnx", f"./input/scrapper/{prompt}").start()