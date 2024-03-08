#このコードはデータベース作成専用
#Flaskでは実行しない
import sqlite3
import os

def create_database(db_name,sql_script):
    # DBフォルダが存在しない場合は作成
    if not os.path.exists('../DB'):
        os.makedirs('../DB')

    # データベース接続
    con = sqlite3.connect(f'../DB/{db_name}.db')
    cur = con.cursor()

    # SQLスクリプトの実行
    cur.executescript(sql_script)

    # コミットして閉じる
    con.commit()
    con.close()

#Userテーブルを作成するSQLスクリプト
#自動振りid、email(ユニーク)、ps、学年、学科
user_sql_script = """
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    grade TEXT NOT NULL,
    department TEXT
);
"""

#Recipeテーブルを作成するSQLスクリプト
#料理id(自動)、料理の組み合わせ、レシピ、画像のパス、作成日時
#ユーザidを外部キーにして消えた場合はデータ削除に設定
recipe_sql_script = """
CREATE TABLE Recipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT,
    newrecipe TEXT,
    content TEXT,
    recipe1 TEXT,
    recipe2 TEXT,
    creation_date TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES User(id) ON DELETE CASCADE
);
"""
#作成なのでmain関数として実行されたら実行
if __name__ == '__main__':
    create_database('user', user_sql_script)
    create_database('recipe', recipe_sql_script)
    print("Databases and tables created successfully.")
