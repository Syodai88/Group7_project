import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const NewRecipeDetails = ({ recipe, imageUrl }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">{recipe.name}</Typography>
      <Typography variant="body1">{recipe.ingredients}</Typography>
      <Typography variant="body1">{recipe.steps}</Typography>
      <Paper elevation={3} sx={{ mt: 2 }}>
        <img src={imageUrl} alt={recipe.name} style={{ width: '100%' }} />
      </Paper>
    </Box>
  );
}

export default NewRecipeDetails;
