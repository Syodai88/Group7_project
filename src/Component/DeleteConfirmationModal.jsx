import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const DeleteConfirmationModal = ({ open, onConfirm, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
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
        <Typography id="delete-confirmation-description" variant="h6">
          本当に削除しますか？
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="contained" color="error" onClick={onConfirm}>はい</Button>
          <Button variant="contained" color="info" onClick={onClose}>いいえ</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
