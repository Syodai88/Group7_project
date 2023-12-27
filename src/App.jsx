import React,{useState,useEffect} from 'react';
import Routers from './Component/Routers';

const App = () => {
  //ローカルストレージから保存している値があればそれを取得、ないなら初期値のfalseとnull
  const storagedIsLoggedIn = localStorage.getItem('isLoggedIn')==='true';
  const storagedUserId = localStorage.getItem('userId');

  const [isLoggedIn, setIsLoggedIn] = useState(storagedIsLoggedIn);
  const [userId, setUserId] = useState(storagedUserId);
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