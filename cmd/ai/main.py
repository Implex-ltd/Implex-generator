import time, httpx, hashlib
import hcaptcha_challenger as solver
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi import FastAPI, HTTPException
from base64 import b64encode
from fastapi import Body
import threading

workers = 0
save = False
challenger = solver.new_challenger()
invalids = []

hashlist = {"xx": ["hash one", "hash two"]}


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


class Task(BaseModel):
    datapoint_uri: str
    task_key: str


class Payload(BaseModel):
    tasklist: List[Task]
    prompt: str


class ChoicePayload(BaseModel):
    tasklist: List[Task]
    prompt: str
    answer_set: str


class Imgs(BaseModel):
    tasklist: List[int]


head = {
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
        task = httpx.get(
            task.json()["url"],
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
        )
        prediction = task.json()["answers"]
        result = {}
        print("prediction:", prediction, question, taskList)
        for i in range(len(taskList)):
            k = taskList[i]["task_key"]
            qa = question.split("Please click on the ")[1].replace(" ", "_")
            c = [
                {
                    "entity_name": 0,
                    "entity_type": qa + "watercolorlmv2",
                    "entity_coords": prediction[i],
                }
            ]
            result[k] = result.get(k, []) + [c]
        print("res", result)
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


def bytedance(payload):
    global workers
    workers += 1

    prompt = payload["question"]
    if prompt not in hashlist:
        hashlist[prompt] = []
    
    print(prompt)
    images = {}

    def scrape(task):
        with httpx.Client(headers=head) as client:
            img = client.get(task["datapoint_uri"].replace("https: //imgs", "https://imgs")).content

            hash = hashlib.md5(img).hexdigest()

            if hashlist[prompt] is not None and hash in hashlist[prompt]:
                images[task["task_key"]] = "true"
                return

            #t = time.time()
            r = challenger.classify(prompt=prompt, images=[img])
            # print(time.time()-t)

            if result := r:
                images[task["task_key"]] = (
                    str(result).lower().replace("[", "").replace("]", "")
                )

                if images[task["task_key"]] == "true":
                    hashlist[prompt].append(hash)

                    with open("./hash.csv", "a+") as ff:
                        ff.write(f"{hash},{prompt}\n")

    threads = []
    for task in payload["tasklist"]:
        t = threading.Thread(target=scrape, args=[task])
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    
    """for task in payload["tasklist"]:
        scrape(task)"""

    workers -= 1
    return images


def _bytedance(payload):
    global workers
    workers += 1

    prompt = payload["question"]
    if prompt not in hashlist:
        hashlist[prompt] = []

    images = {}
    with httpx.Client(headers=head) as client:
        for task in payload["tasklist"]:
            response = client.get(
                task["datapoint_uri"].replace("https: //imgs", "https://imgs")
            )
            if response.status_code == 200:
                hash = hashlib.md5(response.content).hexdigest()

                if hashlist[prompt] is not None and hash in hashlist[prompt]:
                    images[task["task_key"]] = "true"
                    continue

                if save:
                    with open(f"./imgs/{hash}.png", "wb") as f:
                        f.write(response.content)

                if result := challenger.classify(
                    prompt=prompt, images=[response.content]
                ):
                    images[task["task_key"]] = (
                        str(result).lower().replace("[", "").replace("]", "")
                    )

                    if images[task["task_key"]] == "true":
                        hashlist[prompt].append(hash)

                        with open("./hash.csv", "a+") as ff:
                            ff.write(f"{hash},{prompt}\n")
    workers -= 1
    return images


app = FastAPI()
load_hash()

AREA_SELECT = "image_label_area_select"
BINARY = "image_label_binary"


for h in ["caccb7a35ab0091e6368c7d817233868", "c89ba2a922a7cb0125e9c8b425b93a50"]:
    t = time.time()
    if (
        hashlist["Please click each image containing a tree"] is not None
        and h in hashlist["Please click each image containing a tree"]
    ):
        print("found")
    else:
        print("not found")
    print("time hash:", time.time() - t)


def process(data):
    if data["task_type"] not in [AREA_SELECT, BINARY]:
        return {"success": False, "data": {"error": "invalid task_type"}}

    if data["task_type"] == BINARY:
        return {"success": True, "data": bytedance(data)}
        # return {"success": True, "data": predict(AREA_SELECT, data["question"], data["tasklist"])}

    if data["task_type"] == AREA_SELECT:
        return {
            "success": True,
            "data": predict(AREA_SELECT, data["question"], data["tasklist"]),
        }

    print("unknown", data["task_type"])


@app.get("/")
def read_root():
    global workers
    return {"status": "online", "workers": workers}


@app.post("/solve")
def solve(req: dict = Body()):
    try:
        r = process(req)
        print(r)
        return r
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
