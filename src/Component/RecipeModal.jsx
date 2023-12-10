import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const RecipeModal = ({ open, handleClose, recipeId }) => {
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
      </Box>
    </Modal>
  );
};

export default RecipeModal;
