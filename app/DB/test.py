import sqlite3
from datetime import datetime, timedelta



# テストデータ
test_data = [
    {
        'image_path': 'https://via.placeholder.com/150',
        'name': 'テストレシピ1',
        'content': 'これはテストレシピ1です。',
        'recipe1': 'レシピA',
        'recipe2': 'レシピB',
        'creation_date': datetime.now().strftime('%Y-%m-%d'),
        'user_id': 'asaoka.syoudai514@mail.kyutech.jp'

    },
    {
        'image_path': 'https://via.placeholder.com/150',
        'name': 'テストレシピ2',
        'content': 'これはテストレシピ2です。',
        'recipe1': 'レシピC',
        'recipe2': 'レシピD',
        'creation_date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'user_id': 'asaoka.syoudai514@mail.kyutech.jp'
    },
    # 他のテストデータも同様に追加
]

# データベースに接続してテストデータを挿入
with sqlite3.connect("recipe.db") as conn:
    cursor = conn.cursor()

    for data in test_data:
        cursor.execute("""
            INSERT INTO Recipe (image_path, newrecipe, content, recipe1, recipe2, creation_date, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data['image_path'], data['name'], data['content'], data['recipe1'], data['recipe2'], data['creation_date'], data['user_id']))
    
    conn.commit()
