import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import banner from '../../assets/icons/banner.webp'
import './register.css';

function Register() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Register</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Username' id='username' type='text' size="lg" />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='email' type='email' size="lg" />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='password' type='password' size="lg" />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Confirm Password' id='confirmPassword' type='password' size="lg" />

            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg'>Register</MDBBtn>
            <p className='ms-5'>Already have an account? 
              <span onClick={handleLoginRedirect} style={{ color: '#0dcaf0', cursor: 'pointer', textDecoration: 'underline' }}> Log in here</span>
            </p>
          </div>
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src={banner}
            alt="Register image" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' ,backgroundColor: '#f5f5f5'}} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
