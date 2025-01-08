import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import teste from '../../assets/teste6.png';
import './login.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from "../../services/api";

const Login: React.FC = () => {
    const { login } = useContext(AuthContext); // Usando o AuthContext
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });
            login(response.data.token); // Atualiza o estado global de autenticação
            navigate('/'); // Redireciona para a página inicial
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 401) {
                setMessage('Credenciais inválidas');
            } else {
                setMessage('Erro ao tentar login');
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Tenta o backend principal
            await axios.get("http://localhost:8080/healthcheck");
            window.location.href = "http://localhost:8080/oauth2/authorization/google";
        } catch (error) {
            console.warn("Backend principal indisponível, redirecionando para secundário");
            window.location.href = "http://localhost:8081/oauth2/authorization/google";
        }
    };

    const handleRegisterClick = () => navigate('/register');
    const handleForgotPasswordClick = () => navigate('/reset-email');

    return (
        <MDBContainer fluid>
            <MDBRow>
                <MDBCol sm="6">
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            left: '10px',
                        }}
                    ></button>
                    <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
                        <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>
                            Log in
                        </h3>
                        <form onSubmit={(e) => handleLogin(e)}>
                            <MDBInput
                                wrapperClass="mb-4 mx-5 w-100"
                                label="Email address"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                size="lg"
                            />
                            <MDBInput
                                wrapperClass="mb-4 mx-5 w-100"
                                label="Password"
                                name="password_hash"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                size="lg"
                            />
                            <MDBBtn
                                className="mb-4 px-5 mx-5 w-100"
                                size="lg"
                                style={{ backgroundColor: '#61CEE1', color: '#FFFFFF' }}
                                type="submit"
                            >
                                Login
                            </MDBBtn>
                            <MDBBtn
                                className="mb-4 px-5 mx-5 w-100"
                                size="lg"
                                style={{ backgroundColor: '#61CEE1', color: '#FFFFFF' }}
                                onClick={handleGoogleLogin}
                            >
                                Login com Google
                            </MDBBtn>
                        </form>
                        <p className="small mb-5 pb-lg-3 ms-5">
                            <span onClick={handleForgotPasswordClick} style={{ cursor: 'pointer' }}>
                                Forgot password?
                            </span>
                        </p>
                        <p className="ms-5">
                            Don't have an account?{' '}
                            <span
                                onClick={handleRegisterClick}
                                style={{
                                    cursor: 'pointer',
                                    color: '#61CEE1',
                                    textDecoration: 'underline',
                                }}
                                className="link-info"
                            >
                                Register here
                            </span>
                        </p>
                    </div>
                </MDBCol>
                <MDBCol sm="6" className="d-none d-sm-block px-0">
                    <img
                        src={teste}
                        alt="Register image"
                        className="w-100"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'left',
                            backgroundColor: '#ADD8E6',
                        }}
                    />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default Login;
