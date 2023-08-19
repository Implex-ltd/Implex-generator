import time, httpx

if __name__ - "__main__":
    t = time.time()
    res = httpx.post(
                "http://127.0.0.1:1332/solve",
                json={
                    "task_type": "image_label_binary",
                    "question": "robot",
                    "tasklist": [
                        {
                            "datapoint_uri": "https://imgs.hcaptcha.com/Wh3gzOS3NTyJxDMrQiJ6GU7Zo2MOBTtPs2ZXHM4E7TFVoxH8FU4JdWwuDj5WBElIQviIrAu_dZ2XT5B9Oomeh-FBi68Bh2xwpTLzcvaibqhJAcQmC7aCaJ9aKIpHB0FE5q4yCucKJvokV-i-Vzn9-MRpVi-mm2HyDyaeCQ-3qI76HSefFnHIVclH63M1OtDtug1s4aoRlPveT2-ljnDz_vzBdLsBQ4c8wyJstJJjAYoC6rOgL8e3nxMpMsMWVd-UnUsYHy4",
                            "task_key": "e5fe5314-229e-4a06-9a63-7c103988cedb",
                        },
                    ],
                },
            ).text
    et = time.time() - t

    print(f"Solved in {et}s -> {res}")
