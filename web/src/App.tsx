import React, { useEffect, useContext } from 'react';
import './App.css';
import Home from './pages/home';
import Header from './components/header';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetEmail from './components/ResetEmail';
import ResetPassword from './components/ResetPassword';
import Completed from './pages/Completed';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const MainPage = () => {
    return (
        <div>
            <Home />
        </div>
    );
};

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        // Verifica se há token na URL
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        if (token) {
            login(token); // Salva o token no AuthContext
            navigate('/'); // Redireciona para a página inicial
        }
    }, [login, navigate]);

    return (
        <div className="main-container">
            {/* Mostra o Header apenas fora das páginas de login, registro e reset */}
            {location.pathname !== '/login' &&
                location.pathname !== '/register' &&
                location.pathname !== '/reset-email' &&
                location.pathname !== '/reset-password' && <Header />}

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-email" element={<ResetEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/completed" element={<Completed />} />
            </Routes>
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
