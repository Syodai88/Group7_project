def make_vector_method(name,ingredients,steps):
    #必要なライブラリのインポート
    import torch
    import torch.nn.functional as F
    from torch import Tensor
    import pickle
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    import os
    import time
    #今のプログラムの絶対パスを取得
    script_directory = os.path.dirname(os.path.abspath(__file__))
    #スクリプトのあるディレクトリから相対的にdataとmodelディレクトリへのパスを生成
    data_directory = os.path.join(script_directory, '..', 'data')
    model_directory = os.path.join(script_directory, '..', 'model')
    #実際のファイルへのパスを生成
    id_vector_path = os.path.join(data_directory, 'id_vector02.pkl')
    tokenizer_path = os.path.join(model_directory, 'tokenizer.pkl')
    model_path = os.path.join(model_directory, 'model.pkl')

    # 文の平均プーリング関数
    def average_pool(last_hidden_states: Tensor, attention_mask: Tensor) -> Tensor:
        last_hidden = last_hidden_states.masked_fill(~attention_mask[..., None].bool(), 0.0)
        return last_hidden.sum(dim=1) / attention_mask.sum(dim=1)[..., None]

    #id_vectorファイルを読み込む
    with open(id_vector_path, 'rb') as file:
        id_vector = pickle.load(file)

    #ベクトルをリストに格納し、IDを別のリストに格納
    ids = list(id_vector.keys())
    print(len(ids))
    vectors = np.array(list(id_vector.values()))
    



    #保存されたトークナイザーとモデルを読み込む
    with open(tokenizer_path, 'rb') as tokenizer_file:
        tokenizer = pickle.load(tokenizer_file)

    with open(model_path, 'rb') as model_file:
        model = pickle.load(model_file)

    #テキスト形式に変換
    text="料理名は"+name+"\n\n材料は\n"#料理名を格納
    
    for ingridient in ingredients:#材料を格納
        text+=ingridient+"\n"
    
    text+="調理方法は"+steps#調理方法を格納

    #モデルを評価モードに設定
    model.eval()
    print("start enbedding")
    start=time.time()
    #テキストをベクトル化
    with torch.no_grad():
        batch_dict = tokenizer(text, max_length=4096, padding=True, truncation=True, return_tensors='pt')
        outputs = model(**batch_dict)
        embedding = average_pool(outputs.last_hidden_state, batch_dict['attention_mask'])
        embedding = F.normalize(embedding, p=2, dim=1)


    input_vector = embedding.reshape(1, -1)
    print("end enbedding",time.time()-start)

    #コサイン類似度を計算
    print("start cos")
    start=time.time()
    cos_similarities = cosine_similarity(input_vector, vectors)[0]
    print("end cos",time.time()-start)

    print("start sort")
    start=time.time()
    #類似度とIDをペアにしてソート
    id_sim_pairs = sorted(zip(ids, cos_similarities), key=lambda x: x[1], reverse=True)
    print("end sort",time.time()-start)
    import random

    # 乱数生成のシードを設定
    #random.seed(42)あえて設定しない
    print("start random")
    # リストの長さに基づいて範囲を計算
    total_pairs = len(id_sim_pairs)
    top_5_percent_index = total_pairs // 20

    # 上位5%からランダムに2つ選択
    top_pairs = random.sample(id_sim_pairs[:top_5_percent_index], 2)

    # 中間70~50%の範囲を計算
    middle_range_start = total_pairs * 5 // 10
    middle_range_end = total_pairs * 7 // 10

    # 中間範囲からランダムに2つ選択（メモリ効率を考慮）
    middle_pair_indices = random.sample(range(middle_range_start, middle_range_end), 2)
    middle_pairs = [id_sim_pairs[i] for i in middle_pair_indices]

    # 下位5%からランダムに2つ選択
    bottom_pairs = random.sample(id_sim_pairs[-top_5_percent_index:], 2)
    print("end random")

    # 結果を合わせる
    selected_pairs = top_pairs + middle_pairs + bottom_pairs
    result = [{"id": id, "similarity": float(sim)} for id, sim in selected_pairs]

    # 結果を表示
    return result
        
            