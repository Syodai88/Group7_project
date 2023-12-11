import React,{useState,useEffect} from 'react';
import { Modal, Box, Typography } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/base';

const RecipeModal = ({ open, handleClose, recipeId, onRecipeSelect }) => {
  //表示時に調理方法を１ステップごとに番号付で表示したいので配列
  //group7_data内のstepsも配列なのでアクセスはこの方針
  const [recipeDetails, setRecipeDetails]=useState({
    name:"",
    ingridients:[],
    steps:[]
  });

  const fetchRecipeDetails=async()=>{
    try {
      const response = await axios.post('/fetch_recipe_details', recipeId);
      console.log("fetchData_recipe_details"+response.data);
      setRecipeDetails(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //openかidの更新時に実行
  useEffect(()=>{
    if(open){
      fetchRecipeDetails();
    }
  },[open,recipeId]);

  //決定ボタンの機能、recipeIdをRecipeCardを経由してApp.jsxに渡す。
  const handleSelectRecipe=()=>{
    onRecipeSelect(recipeId);
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
        レシピ詳細
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          ここにレシピの詳細が表示されます。ID: {recipeId}
        </Typography>
        <Button variant="outlined" onClick={handleSelectRecipe}>
          この料理を選択！
        </Button>
      </Box>
    </Modal>
  );
};

export default RecipeModal;
