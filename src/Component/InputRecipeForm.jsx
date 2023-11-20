//入力フォームのコンポーネント
import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem  } from '@mui/material';

const InputRecipeForm = ({ onSubmit }) => {
  const [recipe, setRecipe] = useState({ name: '', ingredients: [], steps: '' });

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(recipe);
  };

  const [ingredient, setIngredient]=useState("");
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value);
  };

  const addIngredient = () => {
    if (ingredient.trim() !== '') {
      setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredient] });
      setIngredient('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="レシピ名"
        name="name"
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="食材"
        name="ingredient"
        value={ingredient}
        onChange={handleIngredientChange}
      />
      <Button onClick={addIngredient} variant="contained" sx={{ mt: 1, mb: 2 }}>
        食材を追加
      </Button>
      <List>
        {recipe.ingredients.map((ing, index) => (
          <ListItem key={index}>{ing}</ListItem>
        ))}
      </List>
      <TextField
        margin="normal"
        required
        fullWidth
        label="手順"
        name="steps"
        multiline
        rows={4}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        送信
      </Button>
    </Box>
  );
}

export default InputRecipeForm;
