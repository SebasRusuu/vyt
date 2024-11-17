// Login.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
}
from 'mdb-react-ui-kit';
import teste from '../../assets/teste6.png';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './login.css';

function Login(){
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const onClose = () => {
    navigate('/');
  };

  const handleForgotPasswordClick = () => {
    navigate('/reset-email');
  }

  return (
    <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          {/* <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">Logo</span>
          </div> */}
          <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
              style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  left: '10px'
              }}
          ></button>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg"/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' size="lg"/>

            <MDBBtn 
              className="mb-4 px-5 mx-5 w-100" 
              size="lg" 
              style={{ backgroundColor: '#61CEE1', color: '#FFFFFF' }}
              >
                Login
            </MDBBtn>
            <p className="small mb-5 pb-lg-3 ms-5"><span onClick={handleForgotPasswordClick} style={{cursor: 'pointer'}}>Forgot password?</span></p>
            <p className='ms-5'>Don't have an account? <span onClick={handleRegisterClick} style={{ cursor: 'pointer',color: '#61CEE1', textDecoration: 'underline' }} className="link-info">Register here</span></p>

          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src={teste}
            alt="Register image" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' ,backgroundColor: '#ADD8E6'}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
};

export default Login;
