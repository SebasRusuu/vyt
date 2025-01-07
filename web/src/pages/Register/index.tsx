import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import teste from '../../assets/teste2.png';
import './register.css';
import axiosInstance from "../../services/api";

const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/register', {
                userName: userName,
                email: email,
                password: password
            });

            console.log("Registro bem-sucedido:", response.data);
            navigate('/login');
        } catch (error: any) {
            console.error("Erro no registro:", error.response?.data || error.message);
        }
    };

    return (
        <MDBContainer fluid>
            <MDBRow>
                <MDBCol sm="6">
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => navigate('/login')}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            left: '10px',
                        }}
                    ></button>
                    <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
                        <h3
                            className="fw-normal mb-3 ps-5 pb-3"
                            style={{ letterSpacing: '1px' }}
                        >
                            Register
                        </h3>

                        <form onSubmit={(e) => handleRegister(e)}>
                            <MDBInput
                                wrapperClass="mb-4 mx-5 w-100"
                                label="Name"
                                name="user_name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                type="text"
                                size="lg"
                            />
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
                            <MDBInput
                                wrapperClass="mb-4 mx-5 w-100"
                                label="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                size="lg"
                            />

                            <MDBBtn
                                className="mb-4 px-5 mx-5 w-100"
                                size="lg"
                                style={{backgroundColor: '#61CEE1', color: '#FFFFFF'}}
                                type="submit"
                            >
                                Register
                            </MDBBtn>
                        </form>

                        {error && <p style={{ color: 'red', marginLeft: '20px' }}>{error}</p>}

                        <p className="ms-5">
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                style={{
                                    color: '#61CEE1',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                Log in here
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
                            height: '100vh',
                            objectPosition: 'left',
                            backgroundColor: '#ADD8E6',
                        }}
                    />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default Register;
