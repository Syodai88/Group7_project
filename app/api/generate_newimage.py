import base64
from encodings import utf_8


def generate_newimage(prompt):
    import requests
    import io
    from PIL import Image
    import time
    # Hugging Face API トークン
    
    token = "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"
    API_URL = "https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic"
    # ヘッダーに認証トークンを含める
    headers = {"Authorization": f"Bearer {token}"}
    # モデルへのクエリを送信して画像データを取得する関数
    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        if response.status_code==200:
            return response.content
        return 0#画像生成に失敗
    # モデルにクエリを送信
    image_bytes = query({ "inputs": prompt})
    for i in range(10):
        if image_bytes==0:
            token = "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"
            API_URL = "https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic"
            # ヘッダーに認証トークンを含める
            headers = {"Authorization": f"Bearer {token}"}
            print("再生成",i)
            time.sleep(2)
            image_bytes=query({ "inputs": prompt})
    #最終的に失敗かチェック
    if image_bytes==0:
        with open('../DB/ImageDB/makingfail.png', 'rb') as default_image:
            image_bytes=default_image.read()
    # 画像データのbase64エンコーディング
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    return {"image":image_base64}

