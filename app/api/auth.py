from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash,check_password_hash
import sqlite3 

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data=request.json
    password=data["password"]
    with sqlite3.connect('../DB/user.db') as con:
        cur = con.cursor()
        #SQLインジェクション対策
        cur.execute("SELECT password_hash FROM User WHERE email=?", 
                    (data['email'],))#カンマをつけないとタプルの中身が１つと認識されなくてエラーが起きる
        user = cur.fetchone()#userにはリスト形式で値が入る
        print(user)
        
        if user:
            if check_password_hash(user[0],password):
                return jsonify({"message":"Login success"}),200
            else:
                return jsonify({"message":"Incorrect password"}),401
        else:
            return jsonify({"message":"Not Found Register"}),404


@auth_blueprint.route('/register', methods=['POST'])
def register():
    data=request.json
    password=generate_password_hash(data["password"])#パスワードをハッシュ化

    with sqlite3.connect('../DB/user.db') as con:
        try:
            cur = con.cursor()
            #SQLインジェクション対策
            cur.execute("INSERT INTO User (email, password_hash, grade, department) VALUES (?, ?, ?, ?)", 
                        (data['email'], password, data['grade'], data['department']))
            con.commit()
            return jsonify({"message":"Register success"}),201
        except sqlite3.IntegrityError:
            return jsonify({"message":"Email already exists"}),400