import React,{useState,useEffect} from 'react';
import Routers from './Component/Routers';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (credentials) => {
    // ログインロジックを実装...
    // 成功したら状態を更新
    setIsLoggedIn(true);
  };

  return (
    <Routers isLoggedIn={isLoggedIn} handleLogin={handleLogin} handleRegister={handleRegister} />
  );
}

export default App;
//現状はレシピ生成はできるけどモーダルを作成してからは画像が表示できなくなった。まずは画像の表示を行えるようにしてからモーダルの確認をする