//ヘッダーのコンポーネト
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px', // Set the height of your header
  background: 'orange', // Adjust to your header background color
  color: theme => theme.palette.common.white, // Adjust to your header text color
});

const Header = () => {
  return (
    <AppBar position="static">
      <HeaderContainer>
        <Toolbar>
          <Typography variant="h6">
            レシピアプリ
          </Typography>
        </Toolbar>
      </HeaderContainer>
    </AppBar>
  );
}

export default Header;
