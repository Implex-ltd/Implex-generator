from base64 import b64decode, b64encode
from concurrent.futures import ThreadPoolExecutor
import contextlib
from datetime import datetime
from hashlib import sha1
from json import dumps
from math import floor
import random
import threading
import time
import httpx
from python_ghost_cursor import path
import jwt
import xxhash
import os


class Scraper:
    def __init__(self) -> None:
        self.questions = os.listdir("images")

        self.session = httpx.Client(http2=True, proxies="http://brd-customer-hl_3dea4c4e-zone-data_center:74nxh5mq1pnu@brd.superproxy.io:22225")

        self.session.headers = {
            "Accept": "application/json",
            "Content-Type": "text/plain",
            "Origin": "https://newassets.hcaptcha.com",
            "Referer": "https://newassets.hcaptcha.com/captcha/v1/490cab9/static/hcaptcha.html",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.130",
        }

    def _hsl(self, req):
        x = "0123456789/:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        req = jwt.decode(req, options={"verify_signature": False})

        def a(r):
            for t in range(len(r) - 1, -1, -1):
                if r[t] < len(x) - 1:
                    r[t] += 1
                    return True
                r[t] = 0
            return False

        def i(r):
            t = ""
            for n in range(len(r)):
                t += x[r[n]]
            return t

        def o(r, e):
            n = e
            hashed = sha1(e.encode())
            o = hashed.hexdigest()
            t = hashed.digest()
            e = None
            n = -1
            o = []
            for n in range(n + 1, 8 * len(t)):
                e = t[floor(n / 8)] >> n % 8 & 1
                o.append(e)
            a = o[:r]

            def index2(x, y):
                return x.index(y) if y in x else -1

            return 0 == a[0] and index2(a, 1) >= r - 1 or -1 == index2(a, 1)

        def get():
            for e in range(25):
                n = [0 for i in range(e)]
                while a(n):
                    u = req["d"] + "::" + i(n)
                    if o(req["s"], u):
                        return i(n)

        result = get()
        hsl = ":".join(
            [
                "1",
                str(req["s"]),
                datetime.now()
                .isoformat()[:19]
                .replace("T", "")
                .replace("-", "")
                .replace(":", ""),
                req["d"],
                "",
                result,
            ]
        )
        return hsl

    def checkSiteConfig(self):
        return self.session.get(
            "https://hcaptcha.com/checksiteconfig?v=490cab9&host=discord.com&sitekey=4c672d35-0701-42b2-88c3-78380b0db560&sc=1&swa=0&spst=1"
        ).json()["c"]

    def getCaptcha(self):
        self.session.headers["Content-Type"] = "application/x-www-form-urlencoded"
        timestamp = int((time.time() * 1000) + round(random.random() * (120 - 30) + 30))
        mm = [
            [
                int(p["x"]),
                int(p["y"]),
                int(time.time() * 1000) + round(random.random() * (5000 - 2000) + 2000),
            ]
            for p in path({"x": 100, "y": 100}, {"x": 600, "y": 700})
        ]

        return self.session.post(
            "https://hcaptcha.com/getcaptcha/4c672d35-0701-42b2-88c3-78380b0db560",
            data={
                "v": "490cab9",
                "sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                "host": "discord.com",
                "hl": "en",
                "motionData": dumps(
                    {"st": timestamp, "dct": timestamp, "mm": mm}, separators=(",", ":")
                ),
                "n": self._hsl(self.token["req"]),
                "c": dumps(self.token),
            },
        ).json()

    def format_question(self, question):
        return (
            question.replace("Please click each image containing an ", "")
            .replace("Please click each image containing a ", "")
            .replace("Please click each image containing ", "")
            .replace(" ", "_")
            .lower()
        )

    def sort(
        self,
    ) -> (
        dict
    ):  # sourcery skip: extract-duplicate-method, hoist-similar-statement-from-if, hoist-statement-from-if
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
            for i, img in enumerate(self.taskList)
        }

        task = httpx.post(
            "https://pro.nocaptchaai.com/solve",
            headers={
                "Content-type": "application/json",
                "apikey": "rorm-8473d243-790d-9184-3fa2-76e4ff8424df",
            },
            json={
                "images": imgB64,
                "target": self.question,
                "method": "hcaptcha_base64",
                "sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                "site": "discord.com",
            },
        )
        # print(task.json())
        prediction = task.json()["solution"]
        decoded_images = {key: b64decode(value) for key, value in imgB64.items()}
        resp = [i in prediction for i in range(len(decoded_images))]
        print(f"[>] Got sorting | {self.formatted_question}")
        for index, status in enumerate(resp):
            image_content = decoded_images[str(index)]#
            hash_value = xxhash.xxh64(image_content).hexdigest()

            if status:
                subdirectory = os.path.join("images", self.formatted_question, "yes")
                if not os.path.exists(subdirectory):
                    os.makedirs(subdirectory)

                filename = os.path.join(subdirectory, f"{hash_value}_yes.jpeg")
                if not os.path.exists(filename):
                    with open(filename, "wb") as file:
                        file.write(image_content)
                else:
                    print(f"Duplicate yes: {hash_value}")
            else:
                filename = os.path.join(
                    "images", self.formatted_question, "bad", f"{hash_value}_bad.jpeg"
                )
                if not os.path.exists(filename):
                    with open(filename, "wb") as file:
                        file.write(image_content)
                else:
                    print(f"Duplicate bad: {hash_value}")

    def main(self):  # sourcery skip: extract-method
        with contextlib.suppress(Exception):
            while True:
                self.token = self.checkSiteConfig()
                self.captcha = self.getCaptcha()
                if (
                    "tasklist" in self.captcha
                    and self.captcha["request_type"] != "image_label_area_select"
                ):
                    self.question = self.captcha["requester_question"]["en"]
                    self.formatted_question = self.format_question(self.question)
                    if self.question not in self.questions:
                        base_folder = "images"
                        question_folder = os.path.join(base_folder, self.formatted_question)
                        yes_folder = os.path.join(question_folder, "yes")
                        bad_folder = os.path.join(question_folder, "bad")

                        if not os.path.exists(question_folder):
                            os.makedirs(yes_folder)
                            os.makedirs(bad_folder)
                            print(f"Created: {self.formatted_question}")
                    dir_path = os.path.join("images", self.formatted_question, "yes")
                    jpeg_files = [
                        f for f in os.listdir(dir_path) if f.lower().endswith(".jpeg")
                    ]
                    print(f"{self.formatted_question} | {len(jpeg_files)}")
                    if len(jpeg_files) > 200:
                        print(
                            f"Limit of 200 exceeded for images: {self.formatted_question}"
                        )
                        continue
                    else:
                        self.taskList = self.captcha["tasklist"]

                        print(self.formatted_question)

                        self.sort()
                else:
                    print("no tasklist or image_label_area_select detected")
                    return


if __name__ == "__main__":
    for _ in range(int(input("Threads: "))):
        threading.Thread(target=Scraper().main).start()
