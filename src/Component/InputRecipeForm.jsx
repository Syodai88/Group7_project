import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, Typography, Grid } from '@mui/material';
import axios from 'axios';

//App.jsxのhandleRecipeSubmitがonSubmitに渡される
const InputRecipeForm = ({ onSubmit }) => {
  //stepsは料理工程1単位づつ入力するなら配列でも良い、今の所文字列で\nで区切る
  const [recipe, setRecipe] = useState({ name: '', ingredients: [], steps: '' });
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});

  //エラーチェックの関数、真偽値を返す
  const validateForm = () => {
    let newErrors = {};//エラーオブジェクトの生成
    //テキスト入力はtrimで不要なスペースの削除
    if (!recipe.name.trim()) newErrors.name = 'レシピ名を入力してください';
    if (recipe.ingredients.length === 0) newErrors.ingredients = '少なくとも1つの食材を追加してください';
    if (!recipe.steps.trim()) newErrors.steps = '調理方法を入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;//エラーがなければlengthは0
  };

  //レシピ名と手順のイベントハンドラ、フィールドのnameで確認して対応箇所に適応
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  //材料のイベントハンドラ
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value);
  };

  //手順のイベントハンドラ
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  //具材：分量を追加するときのチェック
  const addIngredient = () => {
    if (ingredient.trim() && quantity.trim()) {
      //ingredients配列に追加、スプレット構文で新オブジェクトを生成する形
      setRecipe({ ...recipe, ingredients: [...recipe.ingredients, `${ingredient}：${quantity}`] });
      //入力欄とエラーの初期化
      setIngredient('');
      setQuantity('');
      setErrors({ ...errors, ingredients: '' });
    } else {//どちらかが空欄の時の処理
      setErrors({ ...errors, ingredients: '具材と分量を両方入力してください' });
    }
  };

  //データの送信
  const handleSubmit = async(e) => {
    e.preventDefault();//送信によるページのリロード防止
    if (validateForm()) {
      try {
        const response = await axios.post('/make_vector',recipe);
        const data=await response.data;
        //計算結果の表示
        data.forEach(item => {
          console.log(`ID: ${item.id}, Similarity: ${item.similarity}`);
        });
        console.log(recipe);
        onSubmit({ recipeData: recipe, similarityData: data });
      }catch(error){
        console.error("Error:",error);
      }
    }
  };

  return (
    //html要素のform指定
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {/*レシピ名の入力欄*/}
      <TextField
        //!!は強制的に真偽値に変換する
        error={!!errors.name}//エラーに何もなければfalseの否定でtrue
        helperText={errors.name}
        margin="normal"
        required
        fullWidth
        label="レシピ名"
        name="name"
        onChange={handleChange}
      />
      {/*Gridで具材と材料の入力欄を横並びに*/}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            label="具材"
            name="ingredient"
            value={ingredient}
            onChange={handleIngredientChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="normal"
            fullWidth
            label="分量"
            name="quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </Grid>
      </Grid>
      <Button onClick={addIngredient} variant="contained" sx={"background-color:orange;"} >
        食材を追加
      </Button>
      {errors.ingredients && <Typography color="error">{errors.ingredients}</Typography>}
      <List>
        {recipe.ingredients.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <TextField
        error={!!errors.steps}
        helperText={errors.steps}
        margin="normal"
        required
        fullWidth
        label="調理方法"
        name="steps"
        multiline
        rows={8}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={"background-color:orange;"}>
        送信
      </Button>
    </Box>
  );
}

export default InputRecipeForm;
