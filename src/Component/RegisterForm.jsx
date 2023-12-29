import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [grade, setGrade] = useState("");
  const [department, setDepartment] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  let navigate = useNavigate();

  // 学科の選択肢
  const departmentsOptions = {
    'B1': ['1類', '2類', '3類'],
    'B2': ['知能情報工学科', '情報通信工学科', '知的システム工学科', '物理情報工学科', '生命情報工学科'],
    'B3': ['知能情報工学科', '情報通信工学科', '知的システム工学科', '物理情報工学科', '生命情報工学科'],
    'B4': ['知能情報工学科', '情報通信工学科', '知的システム工学科', '物理情報工学科', '生命情報工学科'],
    'M1': ['情報創成工学専攻', '先端情報工学専攻', '学際情報工学専攻'],
    'M2': ['情報創成工学専攻', '先端情報工学専攻', '学際情報工学専攻'],
    'D1': ['情報創成工学専攻', '先端情報工学専攻', '学際情報工学専攻'],
    'D2': ['情報創成工学専攻', '先端情報工学専攻', '学際情報工学専攻'],
    'D3': ['情報創成工学専攻', '先端情報工学専攻', '学際情報工学専攻'],
    'その他': ["その他"]
  };

  const handleRegistration = async () => {
    //フラグとエラーの初期化
    let error_flg=0;
    setEmailError('');
    setPasswordError('');
    //メール関係のエラー
    if(!email){
      setEmailError("メールアドレスを入力してください");
      error_flg=1;
    }else if(!email.endsWith("@mail.kyutech.jp")){
      setEmailError("九工大メールを登録してください");
      error_flg=1;
    }
    //パスワード関係のエラー
    if(!password){
      setPasswordError("パスワードを入力してください");
      error_flg=1;
    }else if(password !== confirmPassword){
      setPasswordError("パスワードが一致していません");
      error_flg=1;
    }

    if(error_flg===1){
      return;
    }
    //バックエンドに投げる前にエラーを消す
    setEmailError('');
    setPasswordError('');
    try {
      const response = await axios.post('/auth/register', {
        email:email, 
        password:password, 
        grade:grade, 
        department:department
      });

      if (response.status === 201) {
        console.log(response.data.message);
        navigate('/login');//ログインフォームに移動
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data.message);
        SetEmailError("このメールアドレスは既に登録されています！");
      } else {
        console.error('An error occurred:', error);
        setEmailError('An error occurred:', error);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); //パスワード表示/非表示を切り替え
    setPasswordType(showPassword ? 'text' : 'password');//trueなら表示
  };
  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    const isAlphanumeric = /^[a-zA-Z0-9]*$/;//入力を半角英数字に限定

    if (isAlphanumeric.test(newValue) || newValue === "") {
      setPassword(newValue);
    }
  };
  const handleConfirmPasswordChange = (e) => {
    const newValue = e.target.value;
    const isAlphanumeric = /^[a-zA-Z0-9]*$/;//入力を半角英数字に限定

    if (isAlphanumeric.test(newValue) || newValue === "") {
      setConfirmPassword(newValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ここでバックエンドに登録リクエストを送信
    handleRegistration();
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
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="パスワード"
            type={passwordType}
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="パスワードの確認"
            type={passwordType}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>学年(任意)</InputLabel>
            <Select
              value={grade}
              label="学年"
              onChange={(e) => {
                setGrade(e.target.value);
                setDepartment(''); // 学年が変わると学科をリセット
              }}
            >
              {['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'D3', 'その他'].map((grade) => (
                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {grade && (
            <FormControl fullWidth margin="normal">
              <InputLabel>学科</InputLabel>
              <Select
                value={department}
                label="学科"
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departmentsOptions[grade].map((department) => (
                  <MenuItem key={department} value={department}>{department}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
            登録
          </Button>
          <Typography onClick={() => navigate('/login')} style={{ marginTop: 20, cursor: 'pointer', textDecoration: 'underline' }}>
            ログイン画面へ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;
