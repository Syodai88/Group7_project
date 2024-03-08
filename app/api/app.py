from crypt import methods
from re import S
from flask import Flask, send_from_directory,  request, jsonify
import os
from make_vector_method import make_vector_method
from show_similarities_recipe import show_similarities_recipe
from recipe_details import recipe_details
from newrecipe_gpt import newrecipe_gpt
from generate_newimage import generate_newimage
from auth import auth_blueprint
from db import db_blueprint
from scrape import scrape_blueprint


#Flaskアプリのインスタンス生成、buildフォルダをstatic_folderで指定
#__name__がmainの時のみ起動
app = Flask(__name__, static_folder='../build')#app.pyからの相対パス
@app.route('/', defaults={'path': ''})
#フロントエンドの表示に関する記述
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

#入力をベクトル化してコサイン類似度を求める
#それぞれの値については不要なものの処理などを検討、とりあえず放置
@app.route('/make_vector', methods=['POST'])
def make_vector():
    #JSON形式のオブジェクト、{name,ingredients,steps}
    data = request.json
    #データの分解
    name = data['name']
    ingredients = data['ingredients']
    steps = data['steps']

    result=make_vector_method(name,ingredients,steps)

    #結果をJSON形式で返す
    return jsonify(result)

@app.route('/fetch_similarities_recipes',methods=['POST'])
def fetch_similarities_recipes():
    #JSON形式の配列、idのみがある
    data = request.json
    result = show_similarities_recipe(data)
    #結果をJSON形式で返す
    return jsonify(result)

@app.route('/fetch_recipe_details',methods=['POST'])
def fetch_recipe_details():
    #JSON形式の配列、idとrecipeオブジェクトの予定
    data = request.json
    id = data["id"]

    result = recipe_details(id)

    #結果をJSON形式で返す
    return jsonify(result)

@app.route('/fetch_newrecipe',methods=['POST'])
def fetch_newrecipe():
    #JSON形式の配列、idとrecipeオブジェクト
    data=request.json
    #データの分解
    id = data["id"]
    recipe = data["recipe"]
    #レシピをさらに分解
    name=recipe["name"]
    ingredients = recipe["ingredients"]
    steps = recipe["steps"]
    result = newrecipe_gpt(id,name,ingredients,steps)
    print(result)

    return jsonify(result)

@app.route('/fetch_newimage',methods=['POST'])
def fetch_newimage():
    #promptが渡される
    data=request.json
    prompt=data["prompt"]
    result = generate_newimage(prompt)
    return jsonify(result)

app.register_blueprint(auth_blueprint, url_prefix='/auth')  #ユーザ登録、ログインのBlueprintを登録
app.register_blueprint(db_blueprint, url_prefix='/db') #db関係のBlueprint

app.register_blueprint(scrape_blueprint, url_prefix='/scrape') #自動入力機能





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500)  #別のポートでも空いてれば良い
