import requests
from bs4 import BeautifulSoup
import re
import jaconv
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash,check_password_hash
import sqlite3 
from urllib.parse import urlparse

#分量の表記の設定
def fix_number(s):
   # 余分な全角スペース、タブ、改行を削除
    s = s.replace('\u3000', '').replace('\t', '').replace('\n', '')
    # 余分な記号を削除
    s = s.replace('＾', '').replace('^', '').replace('／', '/')
    # 文字列の前後にある括弧を取り除く処理
    s = re.sub(r'^[\(（]([^)）]*)[\)）]$', r'\1', s)
    s = re.sub(r'^(.*?)[\(（][^)）]*[\)）]', r'\1', s)
    s = re.sub(r'[\(（][^)）]*[\)）](.*?)$', r'\1', s)
    # 文中の「、」を削除
    s = s.replace('、', '')
    # 全角カタカナを保持しつつ、全角数字を半角数字に、全角ASCII文字を半角に変換
    s = jaconv.z2h(s, kana=False, digit=True, ascii=True)
    # 半角カタカナを全角カタカナに変換
    s = jaconv.h2z(s, kana=True, digit=False, ascii=False)
    return s.strip()

def get_hostname_from_url(url):#cookpad.comやwww.kurashiru.comなどを取得
    parsed_url = urlparse(url)
    return parsed_url.hostname

def scrape_cookpad_recipe(url):
    try:
        #Webページの内容を取得
        response=requests.get(url)
        response.raise_for_status()  #HTTPエラーがあれば例外発生

    except requests.exceptions.HTTPError as e:
        #HTTPエラーの処理
        print(f"HTTPエラー: {e}")
        return None
    except requests.exceptions.RequestException as e:
        #その他のリクエストエラーの処理
        print(f"データの取得中にエラーが発生: {e}")
        return None

    try:
        #BeautifulSoupでHTMLを解析
        soup=BeautifulSoup(response.text,'html.parser')

        #料理名を抽出
        recipe_title = soup.find('h1', class_='recipe-title').text.strip()

        #材料と分量を抽出
        ingredients_list = []
        for ingredient in soup.find_all('div', class_='ingredient_row'):#各材料列ごとに実行
            ingredient_name = ingredient.find('div', class_='ingredient_name')
            ingredient_quantity = ingredient.find('div', class_='ingredient_quantity amount')

            if ingredient_quantity is not None:
                ingredient_quantity = ingredient_quantity.text.strip()
            else:
                ingredient_quantity = "不明"

            if ingredient_name is not None:
                ingredient_name = ingredient_name.text.strip()
            else:
                ingredient_name = "不明"
            
            if ((ingredient_name != "不明") and (ingredient_quantity != "不明")):
                ingredient = f"{ingredient_name}: {fix_number(ingredient_quantity)}"
                ingredients_list.append(ingredient)

        #作り方を抽出
        steps = ""
        for step in soup.find_all('li', class_=['step','step_last']):
            step_text = step.find('p', class_='step_text')

            if step_text is not None:
                step_text = step_text.text.strip()
                steps += step_text+"\n"

    except Exception as e:
        # BeautifulSoupに関連するその他のエラー
        print(f"HTMLの解析中にエラーが発生しました: {e}")
        return None

    return recipe_title, ingredients_list, steps

def scrape_rakuten_recipe(url):
    try:
        #Webページの内容を取得
        response=requests.get(url)
        response.raise_for_status()  #HTTPエラーがあれば例外発生

    except requests.exceptions.HTTPError as e:
        #HTTPエラーの処理
        print(f"HTTPエラー: {e}")
        return None
    except requests.exceptions.RequestException as e:
        #その他のリクエストエラーの処理
        print(f"データの取得中にエラーが発生: {e}")
        return None

    try:
        #BeautifulSoupでHTMLを解析
        soup=BeautifulSoup(response.text,'html.parser')

        #料理名を抽出
        recipe_title = soup.find('h1', class_='page_title__text').text.strip()
        recipe_title = recipe_title.replace("レシピ・作り方","").strip()

        #材料と分量を抽出
        ingredients_list = []
        for ingredient in soup.find_all('li', class_='recipe_material__item'):#各材料列ごとに実行
            ingredient_name = ingredient.find('span', class_='recipe_material__item_name')
            ingredient_quantity = ingredient.find('span', class_='recipe_material__item_serving')

            if ingredient_quantity is not None:
                ingredient_quantity = ingredient_quantity.text.strip()
            else:
                ingredient_quantity = "不明"

            if ingredient_name is not None:
                ingredient_name = ingredient_name.text.strip()
            else:
                ingredient_name = "不明"

            ingredient = f"{ingredient_name}: {fix_number(ingredient_quantity)}"
            ingredients_list.append(ingredient)

        #作り方を抽出
        steps = ""
        for step in soup.find_all('li', class_='recipe_howto__item'):
            step_text = step.find('span', class_='recipe_howto__text')

            if step_text is not None:
                step_text = step_text.text.strip()
            else:
                step_text = "不明"

            steps += step_text + "\n"

    except Exception as e:
        # BeautifulSoupに関連するその他のエラー
        print(f"HTMLの解析中にエラーが発生しました: {e}")
        return None

    return recipe_title, ingredients_list, steps

def scrape_delish_kitchen_recipe(url):
    try:
        #Webページの内容を取得
        response=requests.get(url)
        response.raise_for_status()  #HTTPエラーがあれば例外発生

    except requests.exceptions.HTTPError as e:
        #HTTPエラーの処理
        print(f"HTTPエラー: {e}")
        return None
    except requests.exceptions.RequestException as e:
        #その他のリクエストエラーの処理
        print(f"データの取得中にエラーが発生: {e}")
        return None

    try:
        #BeautifulSoupでHTMLを解析
        soup=BeautifulSoup(response.text,'html.parser')

        #料理名を抽出
        title_box = soup.find('div', class_='title-box')
        recipe_image = title_box.find('p', class_='text-h3').text.strip()
        recipe_title = title_box.find('h1', class_='title').text.strip()
        recipe_title = recipe_image+" "+recipe_title

        #材料と分量を抽出
        ingredients_list = []
        for ingredient in soup.find_all('li', class_='ingredient'):#各材料列ごとに実行
            ingredient_name = ingredient.find('a', class_='ingredient-name')
            if ingredient_name==None:#一部spanのものがある
                ingredient_name = ingredient.find('span', class_='ingredient-name')

            ingredient_quantity = ingredient.find('span', class_='ingredient-serving')
            if ingredient_quantity is not None:
                ingredient_quantity = ingredient_quantity.text.strip()
            else:
                ingredient_quantity = "不明"

            if ingredient_name is not None:
                ingredient_name = ingredient_name.text.strip()
            else:
                ingredient_name = "不明"

            ingredient = f"{ingredient_name}: {fix_number(ingredient_quantity)}"
            ingredients_list.append(ingredient)

        #作り方を抽出
        steps = ""
        for step in soup.find_all('li', class_='step'):
            step_text = step.find('p', class_='step-desc')

            if step_text is not None:
                step_text = step_text.text.strip()
            else:
                step_text = "不明"

            steps += step_text + "\n"

    except Exception as e:
        # BeautifulSoupに関連するその他のエラー
        print(f"HTMLの解析中にエラーが発生しました: {e}")
        return None

    return recipe_title, ingredients_list, steps

def scrape_kurashiru_recipe(url):
    try:
        #Webページの内容を取得
        response=requests.get(url)
        response.raise_for_status()  #HTTPエラーがあれば例外発生

    except requests.exceptions.HTTPError as e:
        #HTTPエラーの処理
        print(f"HTTPエラー: {e}")
        return None
    except requests.exceptions.RequestException as e:
        #その他のリクエストエラーの処理
        print(f"データの取得中にエラーが発生: {e}")
        return None

    try:
        #BeautifulSoupでHTMLを解析
        soup=BeautifulSoup(response.text,'html.parser')

        #料理名を抽出
        recipe_title = soup.find('h1', class_='title').text.strip()
        recipe_title = recipe_title.replace("レシピ・作り方","").strip()

        #材料と分量を抽出
        ingredients_list = []
        for ingredient in soup.find_all('li', class_='ingredient-list-item'):#各材料列ごとに実行
            ingredient_name = ingredient.find('a', class_='DlyLink ingredient-name')
            ingredient_quantity = ingredient.find('span', class_='ingredient-quantity-amount')

            if ingredient_quantity is not None:
                ingredient_quantity = ingredient_quantity.text.strip()
            else:
                ingredient_quantity = "不明"

            if ingredient_name is not None:
                ingredient_name = ingredient_name.text.strip()
            else:
                ingredient_name = "不明"

            ingredient = f"{ingredient_name}: {fix_number(ingredient_quantity)}"
            ingredients_list.append(ingredient)

        #作り方を抽出
        steps = ""

        for step in soup.find_all('li', class_='instruction-list-item'):
            step_text = step.find('span', class_='content')

            if step_text is not None:
                step_text = step_text.text.strip()
            else:
                step_text = "不明"

            steps += step_text + "\n"

    except Exception as e:
        # BeautifulSoupに関連するその他のエラー
        print(f"HTMLの解析中にエラーが発生しました: {e}")
        return None

    return recipe_title, ingredients_list, steps

scrape_blueprint = Blueprint('scrape', __name__)
@scrape_blueprint.route('/auto_input', methods=['POST'])
def scrape():
    url=request.json["url"]
    hostname=get_hostname_from_url(url)
    if hostname == "cookpad.com" :
        name, ingredients, steps = scrape_cookpad_recipe(url)
    elif hostname == "recipe.rakuten.co.jp":
        name, ingredients, steps = scrape_rakuten_recipe(url)
    elif hostname == "delishkitchen.tv":
        name, ingredients, steps = scrape_delish_kitchen_recipe(url)
    elif hostname== "www.kurashiru.com" :
        name, ingredients, steps = scrape_kurashiru_recipe(url)
    else:
        return jsonify({'error': 'Unsupported URL'}), 404
    print(ingredients)

    data={"name":name, "ingredients":ingredients, "steps":steps}
    if data:
        return jsonify(data), 200
    else:
        return jsonify({'error': 'Failed to scrape the recipe'}), 400

if __name__ == '__main__':
    #レシピページのURL
    #url = 'https://cookpad.com/recipe/4122019'
    url = 'https://www.kurashiru.com/recipes/6b1dee52-383f-480e-b9c3-962a1951b61c'
    hostname=get_hostname_from_url(url)
    print(hostname)
    if hostname == "cookpad.com" :
        name, ingredients, steps = scrape_cookpad_recipe(url)
    elif hostname == "recipe.rakuten.co.jp":
        name, ingredients, steps = scrape_cookpad_recipe(url)
    elif hostname == "delishkitchen.tv":
        name, ingredients, steps = scrape_delish_kitchen_recipe(url)
    elif hostname== "www.kurashiru.com" :
        name, ingredients, steps = scrape_kurashiru_recipe(url)
    else:
        print("なし")


