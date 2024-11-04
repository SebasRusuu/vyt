import React from 'react';
import './App.css';
import Home from './pages/home';
import Header from './components/header';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

function AppContent() {
  const location = useLocation();

  return (
    <div className="main-container">
      {location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
      
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
