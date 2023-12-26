import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import Header from './Header';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ここでバックエンドにログインリクエストを送信
    onLogin(email, password);
  };

  return (
      <Box>
        <Header/>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="center" width={300}>
            <TextField
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            />
            <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            ログイン
            </Button>
            <Typography onClick={() => navigate('/register')} style={{ marginTop: 20, cursor: 'pointer', textDecoration: 'underline' }}>
            新規登録
            </Typography>
        </Box>
        </Box>
      </Box>
  );
};

export default LoginForm;
