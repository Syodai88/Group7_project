import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, Typography, Grid } from '@mui/material';
import axios from 'axios';

//App.jsxのhandleRecipeSubmitがonSubmitに渡される
const InputRecipeForm = ({ onSubmit, setRecipeState, setButtonState, isInputButtonDisabled}) => {
  //stepsは料理工程1単位づつ入力するなら配列でも良い、今の所文字列で\nで区切る
  const [recipe, setRecipe] = useState({ name: '', ingredients: [], steps: '' });
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(-1);
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

  //分量のイベントハンドラ
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  //既存の具材の変更処理
  const handleIngredientSelect = (index) =>{
    setSelectedIngredientIndex(index);
    console.log("test"+recipe.ingredients[index]);
    const selectedIngredient = recipe.ingredients[index].split(":");
    console.log(selectedIngredient);
    setIngredient(selectedIngredient[0])
    setQuantity(selectedIngredient[1]);
  }

  //具材:分量を追加するときのチェック
  const updateIngredient = () => {
    if (selectedIngredientIndex >= 0){
      const updateIngredients = [...recipe.ingredients];
      updateIngredients[selectedIngredientIndex] = `${ingredient}:${quantity}`;
      setRecipe({...recipe, ingredients : updateIngredients});
    }else{
        if (ingredient.trim() && quantity.trim()) {
          //ingredients配列に追加、スプレット構文で新オブジェクトを生成する形
          setRecipe({ ...recipe, ingredients: [...recipe.ingredients, `${ingredient}:${quantity}`] });
        } else {//どちらかが空欄の時の処理
          setErrors({ ...errors, ingredients: '具材と分量を両方入力してください' });
        }
    }
    //入力欄とエラーの初期化
    setIngredient('');
    setQuantity('');
    setSelectedIngredientIndex(-1);
    setErrors({ ...errors, ingredients: '' });
  };

  //データの送信
  const handleSubmit = async(e) => {
    e.preventDefault();//送信によるページのリロード防止
    if (validateForm()) {
      try {
        setButtonState();
        setRecipeState([{name:"混ぜる料理の候補を探しています..."},{name:"しばらくお待ちください"}])
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
      <Button onClick={updateIngredient} variant="contained" sx={{backgroundColor:'orange'}} >
        {selectedIngredientIndex >= 0 ? '食材を更新' : '食材を追加'}
      </Button>
      {errors.ingredients && <Typography color="error">{errors.ingredients}</Typography>}
      <List>
        {recipe.ingredients.map((item, index) => (
          <ListItem key={index} button onClick={() => handleIngredientSelect(index)}>
            {item}
          </ListItem>
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
      <Button disabled={isInputButtonDisabled} type="submit" fullWidth variant="contained" sx={{backgroundColor:'orange'}}>
        送信
      </Button>
    </Box>
  );
}

export default InputRecipeForm;
