import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import parse from 'html-react-parser';

const ContentModal = ({ open, content, onClose }) => {
  const contentDescriptionWithBreaks = content.replace(/\n/g, '<br>');//\nを<br>タグに変換
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="content-modal-title"
      aria-describedby="content-modal-description"
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
          overflow: 'auto',
          position: 'relative'
        }}>
        <Typography id="content-modal-description" variant="h6">
          {parse(contentDescriptionWithBreaks)}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" color="info" onClick={onClose}>
            閉じる
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ContentModal;
