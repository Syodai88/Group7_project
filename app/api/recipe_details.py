#idを受け取り対応する料理名、材料のリスト、手順のリストを返す
#基本的にgroup7_dataの中身の構造と一致しているのでそのまま入れるだけで良い

def recipe_details(id):
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
    
    detail=[]
    #keyエラー対策でgetメソッドを使用
    recipe_name=title.get(id)
    recipe_ingredients=ingredients.get(id)
    recipe_steps=steps.get(id)

    if not recipe_name:  # recipe_nameが空文字列の時
        recipe_name = 'エラー'

    if not recipe_ingredients:  # recipe_ingredientsが空文字列の時
        recipe_ingredients = 'エラー'

    if not recipe_steps:  # recipe_stepsが空文字列の時
        recipe_steps = 'エラー'
        
    detail.append({"name":recipe_name, "ingredients":recipe_ingredients, "steps":recipe_steps})

    return detail