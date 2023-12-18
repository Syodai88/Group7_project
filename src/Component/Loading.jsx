import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import React, { useState } from 'react';
import LoadingImage from '../picture/chef.gif';


const Loading = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    return (
      <div>
        {/* 画像を表示するボタン */}
        <button onClick={handleOpen}>Show Image</button>
  
        {/* Modal コンポーネント */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar src={LoadingImage} style={{ width: '150px', height: '150px' }}/>
          </div>
        </Modal>
      </div>
    );
  };
  
  export default Loading;


