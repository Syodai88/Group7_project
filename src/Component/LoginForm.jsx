import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, IconButton} from '@mui/material';
import axios from 'axios';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]=useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
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
        //localStorageにデータを保存してリロード後も情報保持
        localStorage.setItem("userId",email);
        localStorage.setItem("isLoggedIn",true);
        navigate('/');//ログインフォームに移動
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("パスワードが違います:",error.response.data.message);
        setError("パスワードが違います");
      } else if(error.response && error.response.status === 404) {
        console.error("ユーザが見つかりません",error.response.data.message);
        setError("ユーザが見つかりません");
      } else{
        console.error("An error occurred:", error);
        setError("An error occurred: " + error.message);
      }
    }
  };
  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    const isAlphanumeric = /^[a-zA-Z0-9]*$/;//入力を半角英数字に限定

    if (isAlphanumeric.test(newValue) || newValue === "") {
      setPassword(newValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    handleLoginCheck();
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // パスワード表示/非表示を切り替え
    setPasswordType(showPassword ? 'text' : 'password');
  };

  return (
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="center" width={300}>
            <TextField
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={error === "ユーザが見つかりません"}
            />
            <TextField
            label="パスワード"
            type={passwordType}
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            error={error === "パスワードが違います"}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            />
            {error && (
              <Typography style={{ color: 'red', marginTop: 10 }}>
                {error}
              </Typography>
            )}
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
