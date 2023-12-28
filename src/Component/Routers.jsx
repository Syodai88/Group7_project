import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Main from './Main';
import Header from './Header';

const Routers = ({ userId, isLoggedIn, handleLogin }) => {
  return (
    <Router>
      <Header userId={userId}/>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Main /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm/>} />
      </Routes>
    </Router>
  );
};

export default Routers;
