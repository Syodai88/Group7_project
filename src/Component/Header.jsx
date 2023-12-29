//ヘッダーのコンポーネト
import React,{useState} from 'react';
import { AppBar, Toolbar, Typography, Button, Modal, Box} from '@mui/material';
import { styled } from '@mui/system';
import HeaderImage from '../picture/headerlogo.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px', // Set the height of your header
  background: 'orange', // Adjust to your header background color
  color: 'black', // Adjust to your header text color
  padding: '0 20px',
  position: 'relative',
});
const Header = ({userId}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  let navigate = useNavigate();

   //ユーザーモーダルの表示/非表示
  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleLogout = () => {
    //ローカルストレージからログイン情報を削除
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    setLogoutConfirmOpen(false);
    window.location.reload();
    setTimeout(() => {
      navigate('/login');
    }, 500);
    
    //ログインページにリダイレクト、リロードして情報を消す
  };

  //確認モーダルの表示/非表示
  const openLogoutConfirm = () => {
    setModalOpen(false);
    setLogoutConfirmOpen(true);
  };
  const closeLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
  };



  return (
    <AppBar position="sticky">
      <HeaderContainer>
        <Toolbar sx={{ justifyContent: 'center', width: '100%' }}>
          {/*ロゴとテキストを中央に配置*/}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={HeaderImage} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Courier New, monospace' }}>
              レシピアプリ
            </Typography>
          </Box>
          {/* 右側のボタン */}
          {userId &&(
            <Box sx={{ position: 'absolute', right: 0 }}>
              <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
              <Button color="inherit">Record</Button>
              <Button color="inherit" onClick={handleModalOpen}>
                <AccountCircleIcon />
              </Button>
            </Box>   
          )}
        </Toolbar>
         {/*ユーザーモーダル */}
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              p: 3,
              minWidth: '300px',
              maxWidth: '80%',
              borderRadius: '8px',
              boxShadow: 24,
            }}
          >
            <Typography variant="h6">ユーザ名：{userId}</Typography>
            <Button variant="outlined" color="primary" onClick={openLogoutConfirm}>
              ログアウト
            </Button>
          </Box>
        </Modal>
        {/*ログアウト確認用のモーダル */}
        <Modal open={logoutConfirmOpen} onClose={closeLogoutConfirm}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              p: 3,
              minWidth: '300px',
              maxWidth: '80%',
              borderRadius: '8px',
              boxShadow: 24,
            }}
          >
            <Typography variant="h6">本当にログアウトしますか？</Typography>
            <Button variant="contained" color="error" onClick={handleLogout}>
              はい
            </Button>
            <Button variant="outlined" onClick={closeLogoutConfirm}>
              いいえ
            </Button>
          </Box>
        </Modal>
      </HeaderContainer>
    </AppBar>
  );
}

export default Header;
