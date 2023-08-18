from onnxruntime import InferenceSession
from PIL import Image
from io import BytesIO
import numpy as np
import json, os, httpx, threading
from base64 import b64encode
import time, xxhash, requests, httpx
import multiprocessing, concurrent

__models__ = list(set(os.listdir("./models")))
__loaded__ = {}

hashlist = {}


def load_hash():
    for lines in open("./hash.csv", "r+").read().splitlines():
        try:
            if "," not in lines:
                continue

            hash, prompt = lines.split(",")

            if prompt not in hashlist:
                hashlist[prompt] = []

            hashlist[prompt].append(hash)
        except:
            pass

    print(len(hashlist), "loaded hash")


class Ai:
    def __init__(self, model):
        global __loaded__

        x = f"./models/{model}"

        if x not in __loaded__:
            print("load", x)
            __loaded__[x] = InferenceSession(
                x,
                providers=[
                    "CUDAExecutionProvider",
                ],
            )

        self.session = __loaded__[x]

    def preprocess_image(self, img):
        image = Image.open(BytesIO(img))
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


def predict(
    captcha_type, question, taskList
) -> dict:  # sourcery skip: extract-duplicate-method
    if captcha_type == "image_label_binary":
        imgB64 = {
            str(i): b64encode(
                httpx.get(
                    str(img["datapoint_uri"]),
                    headers={
                        "authority": "imgs.hcaptcha.com",
                        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "referer": "https://newassets.hcaptcha.com/",
                        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="115", "Google Chrome";v="115"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "image",
                        "sec-fetch-mode": "no-cors",
                        "sec-fetch-site": "same-site",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                    },
                ).content
            ).decode("utf-8")
            for i, img in enumerate(taskList)
        }

        task = httpx.post(
            "https://pro.nocaptchaai.com/solve",
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
            json={
                "images": imgB64,
                "target": question,
                "method": "hcaptcha_base64",
                "sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                "site": "discord.com",
            },
        )
        prediction = task.json()["solution"]
        resp = [i in prediction for i in range(len(taskList))]
        return {
            task["task_key"]: str(resp).lower() for task, resp in zip(taskList, resp)
        }
    elif captcha_type == "image_label_area_select":
        imgB64 = {
            str(i): b64encode(
                httpx.get(
                    str(img["datapoint_uri"]),
                    headers={
                        "authority": "imgs.hcaptcha.com",
                        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "referer": "https://newassets.hcaptcha.com/",
                        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="115", "Google Chrome";v="115"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "image",
                        "sec-fetch-mode": "no-cors",
                        "sec-fetch-site": "same-site",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                    },
                ).content
            ).decode("utf-8")
            for i, img in enumerate(taskList)
        }

        task = httpx.post(
            "https://pro.nocaptchaai.com/solve",
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
            json={
                "images": imgB64,
                "target": question,
                "type": "bbox",
                "method": "hcaptcha_base64",
                "sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                "site": "discord.com",
            },
        )
        print(task.text)
        task = httpx.get(
            task.json()["url"],
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
        )
        prediction = task.json()["answers"]
        result = {}
        print(question)
        qa = question.split("on the ")[1].replace(" ", "_")

        print("prediction:", qa, prediction)
        for i in range(len(taskList)):
            try:
                k = taskList[i]["task_key"]

                c = [
                    {
                        "entity_name": 0,
                        "entity_type": qa + "watercolorlmv2",
                        "entity_coords": prediction[i],
                    }
                ]
                result[k] = result.get(k, []) + [c]
                print(result)
            except Exception as e:
                print("uwu", e, qa, prediction)
                continue
        return result
    elif captcha_type == "image_label_multiple_choice":
        imgB64 = {
            str(i): b64encode(
                httpx.get(
                    str(img["datapoint_uri"]),
                    headers={
                        "authority": "imgs.hcaptcha.com",
                        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "referer": "https://newassets.hcaptcha.com/",
                        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="115", "Google Chrome";v="115"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "image",
                        "sec-fetch-mode": "no-cors",
                        "sec-fetch-site": "same-site",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                    },
                ).content
            ).decode("utf-8")
            for i, img in enumerate(taskList)
        }

        task = httpx.post(
            "https://pro.nocaptchaai.com/solve",
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
            json={
                "images": imgB64,
                "target": question,
                "type": "multi",
                "method": "hcaptcha_base64",
                "sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                "site": "discord.com",
            },
        )
        task = httpx.get(
            task.json()["url"],
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
        )
        print(task.text)
        prediction = task.json()["answers"]
        return prediction


def download_image(url, prompt):
    # Download the first 650 bytes
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        return None, None, None

    content = b""
    for chunk in response.iter_content(chunk_size=650):
        content += chunk
        break  # Download only the first 650 bytes

    # Calculate hash of the downloaded content using XXHash
    content_hash = xxhash.xxh64(content).hexdigest()

    # Check if hash exists in the list
    if hashlist[prompt] is not None and content_hash in hashlist[prompt]:
        return True, content_hash, None

    # Download the complete image
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        return False, None, None

    return False, content_hash, response.content


__lock__ = threading.Lock()


def saves(string, prompt):
    __lock__.acquire()
    with open("./hash.csv", "a+") as ff:
        ff.write(f"{string},{prompt}\n")
    __lock__.release()


class Task(Ai):
    AREA_SELECT = "image_label_area_select"
    BINARY = "image_label_binary"
    HEADER = {
        "authority": "imgs.hcaptcha.com",
        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "referer": "https://newassets.hcaptcha.com/",
        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="115", "Google Chrome";v="115"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    }

    def __init__(self):
        pass

    def parse_question(self, data):
        qa = ""

        if data["task_type"] == Task.BINARY:
            qa = (
                data["question"]
                .split("Please click each image containing a ")[1]
                .replace(" ", "_")
            )

        if data["task_type"] == Task.AREA_SELECT:
            qa = data["question"].split("Please click on the ")[1].replace(" ", "_")

        qa += ".onnx"
        if qa not in __models__:
            return False

        super().__init__(qa)
        return True

    def process(self, data):
        answer = {}

        if data["task_type"] not in [Task.AREA_SELECT, Task.BINARY]:
            return {"success": False, "data": {"error": "invalid task_type"}}

        if data["task_type"] == Task.BINARY:
            t = time.time()
            if not self.parse_question(data):
                return {"success": False, "data": {"error": "model not added yet"}}

            if data["question"] not in hashlist:
                hashlist[data["question"]] = []

            def process_task(task):
                found, imghash, img = download_image(
                    task["datapoint_uri"], data["question"]
                )

                if found:
                    return "true"
                else:
                    if self.determine(img):
                        hashlist[data["question"]].append(imghash)
                        saves(imghash, data["question"])
                        return "true"
                    else:
                        return "false"

            num_threads = min(concurrent.futures.thread.ThreadPoolExecutor()._max_workers, len(data["tasklist"]/2))
            with concurrent.futures.ThreadPoolExecutor(max_workers=num_threads) as executor:
                task_results = list(executor.map(process_task, data["tasklist"]))

            for idx, task in enumerate(data["tasklist"]):
                answer[task["task_key"]] = task_results[idx]

            return answer


def test():
    while True:
        T = Task()

        """print(
            T.process(
                data={
                    "task_type": "image_label_area_select",
                    "question": "Please click on the elephant",
                    "entity_type": "dogwatercolorlmv2",
                    "tasklist": [
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140200745103274044/XmXrKMc.png",
                            "task_key": "e5fe5314-229e-4a06-9a63-7c103988cedb",
                        },
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140200885222379600/sWD4RZ4.png",
                            "task_key": "5f371311-81eb-41e3-b109-4d81b146972d",
                        },
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140200939110805545/2tuzDkJ.png",
                            "task_key": "9d9c4cd4-c5cd-4c9f-aed8-46f8d7639c20",
                        },
                    ],
                },
            )
        )"""

        print(
            T.process(
                data={
                    "task_type": "image_label_binary",
                    "question": "Please click each image containing a robot",
                    "tasklist": [
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140201993110040698/jHzRN5a.png",
                            "task_key": "e5fe5314-229e-4a06-9a63-7c103988cedb",
                        },
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140202059740754022/LzHaow5.png",
                            "task_key": "5f371311-81eb-41e3-b109-4d81b146972d",
                        },
                        {
                            "datapoint_uri": "https://media.discordapp.net/attachments/1139977468325937233/1140202118603624498/GAfDPm0.png",
                            "task_key": "9d9c4cd4-c5cd-4c9f-aed8-46f8d7639c20",
                        },
                        {
                            "datapoint_uri": "https://cdn.discordapp.com/attachments/1139977468325937233/1140224613461274695/31tkN8I.png",
                            "task_key": "e5fe5314-229e-4a06-9a63-7c103988cfsf",
                        },
                        {
                            "datapoint_uri": "https://cdn.discordapp.com/attachments/1139977468325937233/1140224628221026354/Lqv8iHN.png",
                            "task_key": "5f371311-81eb-41e3-b109-4d81b146972q",
                        },
                        {
                            "datapoint_uri": "https://cdn.discordapp.com/attachments/1139977468325937233/1140224653885964379/C0tHiFU.png",
                            "task_key": "9d9c4cd4-c5cd-4c9f-aed8-46f8d7639c56",
                        },
                    ],
                },
            )
        )


load_hash()

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/solve", methods=["POST"])
def add_expense():
    try:
        t = time.time()
        data = request.get_json()
        print(data)
        r = Task().process(data)
        processing_time = time.time() - t

        # Log processing time and result
        print("Processing Time:", processing_time, "seconds")

        response = app.response_class(
            response=json.dumps({"success": True, "data": r}),
            status=200,
            mimetype="application/json",
        )

        return response

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=1332)
