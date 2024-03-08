def show_similarities_recipe(ids):
    import pickle
    import os
    #今のプログラムの絶対パスを取得
    script_directory = os.path.dirname(os.path.abspath(__file__))
    #スクリプトのあるディレクトリから相対的にdataディレクトリのパスを生成
    data_directory = os.path.join(script_directory, '..', 'data')
    #実際のファイルへのパスを生成
    title_path = os.path.join(data_directory, 'title.pkl')
    ingredients_path = os.path.join(data_directory, 'ingredients_quantity.pkl')
    steps_path = os.path.join(data_directory, 'steps_remove.pkl')

    #必要データのダウンロード
    with open(title_path, 'rb') as file:
        title=pickle.load(file)
    with open(ingredients_path, 'rb') as file:
        ingredients=pickle.load(file)
    with open(steps_path, 'rb') as file:
        steps=pickle.load(file)
    #{id,name}の辞書を返すようにする
    recipe_details=[]
    for id in ids:
        recipe_name=title.get(id)#kyeエラー対策でgetメソッドを使用
        recipe_ingredients=ingredients.get(id)
        recipe_steps=steps.get(id)
        #エラー処理は後日記述
        recipe_details.append({"id":id, "name":recipe_name, "ingredients":recipe_ingredients, "steps":recipe_steps})
    return recipe_details

