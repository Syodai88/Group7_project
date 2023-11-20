//類似度が高い料理を表示するコンポーネント
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const RecipeCard = ({ recipe }) => {
  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {recipe.name}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RecipeCard;
