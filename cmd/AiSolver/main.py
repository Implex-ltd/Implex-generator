from fastapi import FastAPI, HTTPException
from onnxruntime import InferenceSession
from httpx import Client
from PIL import Image
from io import BytesIO
import numpy as np
import json, os, httpx, contextlib
from base64 import b64encode
from fastapi import Request

__models__ = list(set(os.listdir("./models")))


class Ai:
    def __init__(self, model):
        self.session = InferenceSession(f"./models/{model}")

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
    with contextlib.suppress(Exception):
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
                task["task_key"]: str(resp).lower()
                for task, resp in zip(taskList, resp)
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
            task = httpx.get(
                task.json()["url"],
                headers={
                    "Content-type": "application/json",
                    "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
                },
            )
            prediction = task.json()["answers"]
            result = {}
            print("prediction:", prediction)
            for i in range(len(taskList)):
                k = taskList[i]["task_key"]
                qa = question.split("Please click each image containing a ")[1].replace(
                    " ", "_"
                )
                c = [
                    {
                        "entity_name": 0,
                        "entity_type": qa+"watercolor-lmv2",
                        "entity_coords": prediction[i],
                    }
                ]
                result[k] = result.get(k, []) + [c]
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

    def download(self, url):
        with Client(headers=Task.HEADER) as client:
            return client.get(url).content

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

        print(f"load model: {qa}")
        super().__init__(qa)
        return True

    def process(self, data):
        answer = {}

        if data["task_type"] not in [Task.AREA_SELECT, Task.BINARY]:
            return {"success": False, "data": {"error": "invalid task_type"}}

        if data["task_type"] == Task.AREA_SELECT and "entity_type" not in data:
            return {"success": False, "data": {"error": "invalid entity_type"}}

        for task in data["tasklist"]:
            if data["task_type"] == Task.BINARY:
                if not self.parse_question(data):
                    return {"success": False, "data": {"error": "model not added yet"}}

                img = self.download(task["datapoint_uri"])
                answer[task["task_key"]] = "true" if self.determine(img) else "false"

            if data["task_type"] == Task.AREA_SELECT:
                answer = predict(data["task_type"], data["question"], data["tasklist"])

        return {"success": True, "data": answer}


def test():
    T = Task()

    print(
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
    )

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


# test()

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": "online"}


@app.post("/solve")
async def solve(req: Request):
    data = await req.json()

    print(data)
    try:
        r = Task().process(data)
        print(r)
        return r
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
