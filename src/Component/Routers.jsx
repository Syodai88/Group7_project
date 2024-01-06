import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Main from './Main';
import Header from './Header';
import RecipeTable from './RecipeTable';

const Routers = ({ userId, isLoggedIn, handleLogin }) => {
  return (
    <Router>
      <Header userId={userId}/>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Main userId={userId}/> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/record" element={<RecipeTable userId={userId}/>} />
      </Routes>
    </Router>
  );
};

export default Routers;
