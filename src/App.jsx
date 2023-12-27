import React,{useState,useEffect} from 'react';
import Routers from './Component/Routers';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  console.log(userId);
  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id);
  };
  return (
    <Routers isLoggedIn={isLoggedIn} handleLogin={handleLogin}/>
  );
}

export default App;
//現状はレシピ生成はできるけどモーダルを作成してからは画像が表示できなくなった。まずは画像の表示を行えるようにしてからモーダルの確認をする
//→これ単に画像生成に失敗してただけかも