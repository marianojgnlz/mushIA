import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './chat';
import Login from './login';
import HomePage from './home';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<Chatbot />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
