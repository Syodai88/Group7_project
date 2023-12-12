import React, { useState } from 'react';
import { Card, CardContent, Typography, Button} from '@mui/material';
import RecipeModal from './RecipeModal'; 

const RecipeCard = ({ recipe, onRecipeSelect}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  

  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {recipe.name}
        </Typography>
        
        {recipe.id && (
          <Button variant="outlined" onClick={handleOpenModal}>
            作り方を見る！
          </Button>
        )}
        
      </CardContent>
      <RecipeModal
        open={modalOpen}
        handleClose={handleCloseModal}
        recipe={recipe}
        onRecipeSelect={onRecipeSelect}
      />
    </Card>
  );
};

export default RecipeCard;
