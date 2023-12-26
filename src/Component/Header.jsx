//ヘッダーのコンポーネト
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import HeaderImage from '../picture/headerlogo.png';

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px', // Set the height of your header
  background: 'orange', // Adjust to your header background color
  color: 'black', // Adjust to your header text color
  padding: '0 20px',
});

const Header = () => {
  return (
    <AppBar position="sticky">
      <HeaderContainer>
        <Toolbar>
          <img src={HeaderImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <Typography variant="h6" fontFamily="Courier New, monospace">
            レシピアプリ
          </Typography>
        </Toolbar>
      </HeaderContainer>
    </AppBar>
  );
}

export default Header;
