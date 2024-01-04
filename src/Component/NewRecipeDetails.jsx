//新しいレシピの詳細を表示するためのコンポーネント
import React from 'react';
import {Box, Paper } from '@mui/material';
import NewRecipeModal from './NewRecipeModal';
//imgのaltに画像を生成できなかった場合の画像が欲しい、できれば謝ってる感じのパンダ
const NewRecipeDetails = ({ recipe, imageUrl, open, onClose, onSave }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ mt: 2 }}>
        <img src={imageUrl} alt={recipe} style={{ width: '100%' }} />
      </Paper>
      <NewRecipeModal open={open} recipe={recipe} onClose={onClose} onSave={onSave} />
    </Box>
  );
}

export default NewRecipeDetails;
