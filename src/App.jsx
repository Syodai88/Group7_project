import React from 'react';
import Header from './Component/Header';
import InputRecipeForm from './Component/InputRecipeForm';
import RecipeCard from './Component/RecipeCard';
import NewRecipeDetails from './Component/NewRecipeDetails';
import Grid from '@mui/material/Grid';

const App = () => {
  // 仮のレシピデータと画像URL
  const sampleRecipes = [
    { name: 'レシピ1' },
    { name: 'レシピ2' },
    { name: 'レシピ3' }
    // ここに他のレシピを追加できます
  ];

  // 仮のオリジナルレシピデータと画像URL
  const originalRecipe = {
    name: 'オリジナルレシピ',
    ingredients: '材料A、材料B、材料C',
    steps: '手順1、手順2、手順3'
  };
  const imageUrl = 'src/stable-diffusion-v1-5.jpeg'; // ここに実際の画像URLを設定

  return (
    <div className="App">
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputRecipeForm onSubmit={(data) => console.log(data)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <div>
            {sampleRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
          <NewRecipeDetails recipe={originalRecipe} imageUrl={imageUrl} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
