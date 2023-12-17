import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { Button } from '@mui/base';

const RecipeModal = ({ open, handleClose, recipe, onRecipeSelect }) => {
  //決定ボタンの機能、recipeIdをRecipeCardを経由してApp.jsxに渡す。
  const handleSelectRecipe=()=>{
    onRecipeSelect(recipe.id);
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto'
        }}>
        <Typography id="modal-modal-name" variant="h6" component="h2">
          {recipe.name}
        </Typography>
        <Typography id="modal-modal-ingredients" sx={{ mt: 2 }}>
          材料:
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <Typography key={index}>{ingredient}</Typography>
          ))}
        </Typography>

        <Typography id="modal-modal-steps" sx={{ mt: 2 }}>
          手順:
          {recipe.steps && recipe.steps.map((step, index) => (
            <Typography key={index}>{index + 1}. {step}</Typography>
          ))}
        </Typography>
        <Button variant="outlined" onClick={handleSelectRecipe}>
          この料理を選択！
        </Button>
      </Box>
    </Modal>
  );
};

export default RecipeModal;
