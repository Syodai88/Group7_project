import React, { useState } from 'react';
import { Card, CardContent, Typography, Button} from '@mui/material';
import RecipeModal from './RecipeModal'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';

const RecipeCard = ({ recipe, index, onRecipeSelect}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getIcon = (index,id) => {
    if(id){
      if (index % 6 === 0 || index % 6 === 1) {
        return <CheckCircleIcon style={{ color: '#00cc66' }} />;
      } else if (index % 6 === 2 || index % 6 === 3) {
        return <WarningIcon style={{ color: '#ffcc00' }} />;
      } else {
        return <DangerousIcon style={{ color: '#b11d2c' }} />;
      }
    }
  };

  

  return (
    <Card sx={{ minWidth: 275, margin: 2, backgroundColor:"#efefef"}}>
      <CardContent>
        <Typography variant="h5" component="div">
          {getIcon(index,recipe.id)}
          <span style={{ marginLeft: '10px' }}>{recipe.name}</span>
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
