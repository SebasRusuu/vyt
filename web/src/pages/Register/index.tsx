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
import { registerUser } from '../../services/authService';
import teste from '../../assets/teste2.png';
import './register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password_hash: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password_hash !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Chama a função de registro
      await registerUser({
        user_name: formData.user_name,
        email: formData.email,
        password_hash: formData.password_hash,
      });

      setSuccess('User registered successfully!');
      navigate('/login'); // Redireciona para a página de login
    } catch (err: any) {
      setError(err.message); // Exibe o erro no frontend
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

              <form onSubmit={handleSubmit}>
                <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    label="Name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    type="text"
                    size="lg"
                />
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
                <MDBInput
                    wrapperClass="mb-4 mx-5 w-100"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                  Register
                </MDBBtn>
              </form>

              {error && <p style={{ color: 'red', marginLeft: '20px' }}>{error}</p>}
              {success && (
                  <p style={{ color: 'green', marginLeft: '20px' }}>{success}</p>
              )}

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
