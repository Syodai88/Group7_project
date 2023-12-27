import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import Header from './Header';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const handleLoginCheck = async () => {
    try {
      const response = await axios.post('/auth/login', {
        email:email, 
        password:password, 
      });

      if (response.status === 200) {//ログイン成功
        console.log(response.data.message);
        onLogin(email);//ログイン状態にしてuserIdにメールを渡す
        navigate('/');//ログインフォームに移動
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("パスワードが違います:",error.response.data.message);
      } else if(error.response && error.response.status === 404) {
        console.error("ユーザが見つかりません",error.response.data.message);
      } else{
        console.error('An error occurred:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleLoginCheck();
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
