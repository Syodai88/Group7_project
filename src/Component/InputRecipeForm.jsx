import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemIcon, Typography, Grid } from '@mui/material';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; 

//App.jsxのhandleRecipeSubmitがonSubmitに渡される
const InputRecipeForm = ({ onSubmit, setRecipeState, setButtonState, isInputButtonDisabled}) => {
  //stepsは料理工程1単位づつ入力するなら配列でも良い、今の所文字列で\nで区切る
  const [recipe, setRecipe] = useState({ name: '', ingredients: [], steps: '' });
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [url, setUrl] = useState('');

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
  //URLのイベントハンドラ
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  
  //既存の具材の変更処理
  const handleIngredientSelect = (index) =>{
    if(selectedIngredientIndex === index){//もう選択していて同じとこを押した時
      setSelectedIngredientIndex(-1);
      setIngredient("");
      setQuantity("");
    }else{
        setSelectedIngredientIndex(index);
        const selectedIngredient = recipe.ingredients[index].split(":");
        setIngredient(selectedIngredient[0].trim());
        setQuantity(selectedIngredient[1].trim());
    }
  }

  //具材:分量を追加するときのチェック
  const updateIngredient = () => {
    if (selectedIngredientIndex >= 0){//更新処理
      const updateIngredients = [...recipe.ingredients];//今の配列を渡す
      if (ingredient.trim() && quantity.trim()) {
        updateIngredients[selectedIngredientIndex] = `${ingredient}:${quantity}`;//indexの場所を更新
        setRecipe({...recipe, ingredients : updateIngredients});//配列を完全新しくする
        setIngredient('');
        setQuantity('');
        setSelectedIngredientIndex(-1);
        setErrors({ ...errors, ingredients: '' });
      }else{
        setErrors({ ...errors, ingredients: '具材と分量を両方入力してください' });
      }
    }else{//追加処理
      if (ingredient.trim() && quantity.trim()) {
        //ingredients配列に追加、スプレット構文で新オブジェクトを生成する形
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, `${ingredient}:${quantity}`] });
        setIngredient('');
        setQuantity('');
        setSelectedIngredientIndex(-1);
        setErrors({ ...errors, ingredients: '' });
      } else {//どちらかが空欄の時の処理
        setErrors({ ...errors, ingredients: '具材と分量を両方入力してください' });
      }
    }
  };

  //データの送信
  const handleSubmit = async(e) => {
    e.preventDefault();//送信によるページのリロード防止
    if (validateForm()) {
      try {
        setButtonState();
        console.log(recipe);
        setRecipeState([{name:"混ぜる料理の候補を探しています..."},{name:"しばらくお待ちください"}])
        const response = await axios.post('/make_vector',recipe);
        //計算結果の表示
        onSubmit({ recipeData: recipe, similarityData: response.data });
      }catch(error){
        console.error("Error:",error);
      }
    }
  };

  return (
    //html要素のform指定
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            <ListItemIcon>
              {selectedIngredientIndex === index ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon /> }
            </ListItemIcon>
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
        multiline//改行コードを自動反映
        rows={8}
        onChange={handleChange}
      />
      <Button disabled={isInputButtonDisabled} type="submit" fullWidth variant="contained" sx={{backgroundColor:'orange'}}>
        送信
      </Button>
      <TextField
        //!!は強制的に真偽値に変換する
        error={!!errors.name}//エラーに何もなければfalseの否定でtrue
        helperText={errors.name}
        margin="normal"
        required
        fullWidth
        label="URL"
        name="url"
        onChange={handleUrlChange}
      />
      <Button disabled={isInputButtonDisabled} type="submit" fullWidth variant="contained" sx={{backgroundColor:'orange'}}>
        送信
      </Button>
    </Box>
  );
}

export default InputRecipeForm;
