import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Modal, Box } from '@mui/material';
import RecipeModal from './RecipeModal'; // モーダルのコンポーネントをインポート

const RecipeCard = ({ recipe }) => {
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
        recipeId={recipe.id}
      />
    </Card>
  );
};

export default RecipeCard;
