import sqlite3

def execute_sql(db_name, sql_script):
    con = sqlite3.connect(f'{db_name}.db')
    cur = con.cursor()
    cur.executescript(sql_script)
    con.commit()
    con.close()

# データベースの内容を表示する関数
def display_data(db_name, table_name):
    con = sqlite3.connect(f'{db_name}.db')
    cur = con.cursor()
    cur.execute(f'SELECT * FROM {table_name}')
    rows = cur.fetchall()
    con.close()

    for row in rows:
        print(row)

def update_recipe_data(db_name):
    con = sqlite3.connect(f'{db_name}.db')
    cur = con.cursor()

    # 画像のパスを更新
    # ここでは '/home/group7/group7_app/api/../DB/ImageDB/' を '/static/images/' に置換
    cur.execute("UPDATE Recipe SET image_path = REPLACE(image_path, 'DB/ImageDB/d026d4f8-c095-4d6b-bcfb-88e406a9904b.jpg', 'd026d4f8-c095-4d6b-bcfb-88e406a9904b.jpg')")

    # 日付の形式を更新
    # '24/01/15' を '24-01-15' に置換
    cur.execute("UPDATE Recipe SET creation_date = REPLACE(creation_date, '202024-01-15', '2024-01-15')")

    con.commit()
    con.close()

# データベースを更新
update_recipe_data('recipe')

# 更新後のデータを表示
display_data('recipe', 'Recipe')

# テストデータの挿入前の内容を表示
display_data('user', 'User')
print("NEXT DB")
display_data('recipe', 'Recipe')
'''
# テストデータの挿入
insert_script = """
INSERT INTO User (email, password_hash, grade, department) VALUES 
('user@example.com', 'hashed_password', '1st', 'Engineering');
"""
execute_sql('user', insert_script)
print("1")
display_data(1,'user', 'User')

# データの更新
update_script = """
UPDATE User SET grade = '3rd' WHERE email = 'user@example.com';
"""
execute_sql('user', update_script)

# データベースの内容を表示
print("2")
display_data(2,'user', 'User')

# テストデータの削除
delete_script = """
DELETE FROM User WHERE email = 'user@example.com';
"""
execute_sql('user', delete_script)
display_data(2,'user', 'User')

# テストデータの削除
delete_script = """
DELETE FROM User WHERE email = 'user@example.com';
"""
execute_sql('user', delete_script)
print("3")
display_data(3,'user', 'User')
'''
