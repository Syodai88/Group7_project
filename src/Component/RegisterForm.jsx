import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Header from './Header';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [department, setDepartment] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ここでバックエンドに登録リクエストを送信
    onRegister(email, password, grade, department, secretQuestion, secretAnswer);
  };

  return (
    <Box>
      <Header />
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
          <FormControl fullWidth margin="normal">
            <InputLabel>学年</InputLabel>
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
          <TextField
            label="秘密の質問"
            value={secretQuestion}
            onChange={(e) => setSecretQuestion(e.target.value)}
            margin="normal"
          />
          <TextField
            label="秘密の答え"
            value={secretAnswer}
            onChange={(e) => setSecretAnswer(e.target.value)}
            margin="normal"
          />
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
