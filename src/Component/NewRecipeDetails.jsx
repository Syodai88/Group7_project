//新しいレシピの詳細を表示するためのコンポーネント
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const NewRecipeDetails = ({ recipe, imageUrl }) => {
  const recipeDescriptionWithBreaks = recipe.replace(/\n/g, '<br>');
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" dangerouslySetInnerHTML={{ __html: recipeDescriptionWithBreaks }} />
      <Paper elevation={3} sx={{ mt: 2 }}>
        <img src={imageUrl} alt={recipe.name} style={{ width: '100%' }} />
      </Paper>
    </Box>
  );
}

export default NewRecipeDetails;
