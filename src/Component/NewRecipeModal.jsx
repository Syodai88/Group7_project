import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import parse from 'html-react-parser';

const NewRecipeModal = ({ open, recipe, onClose, onSave }) => {
    const recipeDescriptionWithBreaks = recipe.replace(/\n/g, '<br>');//\nを<br>タグに変換
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="new-recipe-modal-title"
            aria-describedby="new-recipe-modal-description"
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
                <Typography id="new-recipe-modal-name" variant="h6" component="h2">
                    {parse(recipeDescriptionWithBreaks)}
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button variant="contained" color="success" onClick={onSave}>
                        保存する
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default NewRecipeModal;