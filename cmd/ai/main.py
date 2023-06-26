import httpx, hashlib
import hcaptcha_challenger as solver
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

workers = 0
save = True
challenger = solver.new_challenger()

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
        'authority': 'imgs.hcaptcha.com',
        'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'referer': 'https://newassets.hcaptcha.com/',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    }

def bytedance(payload: Payload):
    global workers
    workers += 1
    
    prompt = payload.prompt
    if prompt not in hashlist:
        hashlist[prompt] = []

    images = {}
    with httpx.Client(headers=head) as client:
        for task in payload.tasklist:
            response = client.get(task.datapoint_uri.replace("https: //imgs", "https://imgs"))
            if response.status_code == 200:
                hash = hashlib.md5(response.content).hexdigest()

                if hashlist[prompt] is not None and hash in hashlist[prompt]:
                    images[task.task_key] = "true"
                    continue

                if save:
                    with open(f'./imgs/{hash}.png', 'wb') as f:
                        f.write(response.content)

                if result := challenger.classify(prompt=prompt, images=[response.content]):
                    images[task.task_key] = str(result).lower().replace('[', '').replace(']', '')

                    if images[task.task_key] == "true":
                        hashlist[prompt].append(hash)

                        with open('./hash.csv', 'a+') as ff:
                            ff.write(f'{hash},{prompt}\n')
    workers -= 1
    return images


app = FastAPI()
load_hash()

@app.get("/")
def read_root():
    global workers
    return {"status": "online", "workers": workers}


@app.post("/solve")
def solve(payload: Payload):
    try:
        return bytedance(payload)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/solvechoice")
def solve(payload: ChoicePayload):
    try:
        print(payload)
        return {} #}bytedance(payload)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))