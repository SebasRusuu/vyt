import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { loginUser } from '../../services/authService';
import teste from '../../assets/teste6.png';
import './login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password_hash: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.token); // Armazena o token no LocalStorage
      navigate('/'); // Redireciona para a página inicial
    } catch (err: any) {
      setError(err.message);
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
              <h3
                  className="fw-normal mb-3 ps-5 pb-3"
                  style={{ letterSpacing: '1px' }}
              >
                Log in
              </h3>
              <form onSubmit={handleSubmit}>
                <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    label="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    size="lg"
                />
                <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    label="Password"
                    name="password_hash"
                    value={formData.password_hash}
                    onChange={handleChange}
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
              </form>
              {error && <p style={{ color: 'red', marginLeft: '20px' }}>{error}</p>}
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
