from flask import Blueprint, request, jsonify, send_file
import sqlite3 
import os
import pickle
from datetime import datetime
import base64
import uuid #一意のファイルネームを作成するため
import re


db_blueprint = Blueprint('db', __name__, static_folder='../DB/ImageDB', static_url_path='/images')

@db_blueprint.route('/save', methods=['POST'])
def register():
    #今のプログラムの絶対パスを取得
    script_directory = os.path.dirname(os.path.abspath(__file__))
    #スクリプトのあるディレクトリから相対的にdataディレクトリのパスを生成
    data_directory = os.path.join(script_directory, '..', 'data')
    #ファイルへのパスを生成
    title_path = os.path.join(data_directory, 'title.pkl')
    with open(title_path, 'rb') as file:
        title=pickle.load(file)
    
    data=request.json #フロントからデータの取得
    #データの分解
    image=data["image"]
    newRecipe=data["newRecipe"]
    recipe1=data["inputRecipe"]
    recipe2=title[data["confusionRecipeId"]]#idからレシピ名を取得する

    #保存するデータの整理
    creation_date=datetime.now().strftime('%Y-%m-%d')#作成日
    if "base64," in image:
        base64_encoded_data = image.split("base64,")[1]#base64エンコード指定のフロントデータから画像データ部分を抜きとる
        image_bytes = base64.b64decode(base64_encoded_data)#画像データをバイナリに変換
        file_name = str(uuid.uuid4()) + ".jpg"#固有のファイル名を生成
        image_path = os.path.join(script_directory, '..', 'DB', 'ImageDB', file_name)#DBフォルダのImageDBに画像を保存するパス
        with open(image_path, 'wb') as image_file:
            image_file.write(image_bytes)
    else:
        ImageDB_directory = os.path.join(script_directory, '..', 'DB','ImageDB')
        image_path=os.path.join(ImageDB_directory, 'makingfail.png')

    # レシピ名の抽出
    match = re.search(r"料理名[^\w]*(.+)", newRecipe)
    if match:
        full_string = match.group(1)
        recipe_name_match = re.search(r"^([\w\s]+)[\n\"]", full_string)
        if recipe_name_match:
            recipe_name = recipe_name_match.group(1)
        else:
            recipe_name = full_string
    else:
        recipe_name="レシピ名は詳細に！"
    
    #データベースへの保存処理
    try:
        with sqlite3.connect('../DB/recipe.db') as con:
            cursor = con.cursor()
            cursor.execute("""
                INSERT INTO Recipe (image_path, newrecipe, content, recipe1, recipe2, creation_date, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (file_name, recipe_name, newRecipe, recipe1, recipe2, creation_date, data["userId"]))
            con.commit()
        return jsonify({"message": "Save success"}), 200
    except sqlite3.Error:
        return jsonify({"message": "Save failed"}), 500

@db_blueprint.route('/load', methods=['GET'])
def fetch_recipes():
    print("data",request.args.get("userId"))
    userId=request.args.get("userId")
    try:
        with sqlite3.connect('../DB/recipe.db') as con:
            con.row_factory = sqlite3.Row  #行を辞書として取得
            cursor = con.cursor()
            #idに一致するデータを取得
            cursor.execute("SELECT * FROM Recipe WHERE user_id = ?", (userId,))
            rows = cursor.fetchall()#データを格納
            #データを辞書のリストに変換
            recipes = [dict(row) for row in rows]#アクセスを容易にできる
            print(recipes)
            return jsonify({"message": "Load success","data":recipes}), 200
    except sqlite3.Error:
        return jsonify({"message": "Load failed"}), 500

@db_blueprint.route('/image/<filename>')
def get_image(filename):
    image_path = os.path.join(db_blueprint.static_folder, filename)
    print(image_path)
    if os.path.isfile(image_path):
        return send_file(image_path, mimetype='image/jpeg')
    else:
        return "Image not found", 404


@db_blueprint.route('/delete_recipe', methods=['DELETE'])
def delete_recipe():
    data = request.get_json()
    deleteId = data["id"]
    print(deleteId)
    try:
        with sqlite3.connect('../DB/recipe.db') as con:
            con.row_factory = sqlite3.Row  #行を辞書として取得
            cursor = con.cursor()
            cursor.execute("DELETE FROM Recipe WHERE id = ?", (deleteId,))
            con.commit()
            return jsonify({"message": "Delete success"}), 200
    except sqlite3.Error as e:
        return jsonify({"message": "Error deleting recipe", "error": str(e)}), 500