import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import teste from '../../assets/teste.png';

function ResetEmail() {
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    // Aqui, você pode adicionar a lógica de envio do email para o backend

    navigate('/reset-password'); // Redireciona para a página de redefinição de senha
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Reset Password</h3>

            <p className='mx-5'>Enter your email address to receive password reset instructions.</p>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='email' type='email' size="lg" />

            <MDBBtn
              className="mb-4 px-5 mx-5 w-100"
              color='info'
              size='lg'
              onClick={handleEmailSubmit}
            >
              Confirm
            </MDBBtn>
          </div>
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src={teste}
            alt="Register image" className="w-100" style={{ objectFit: 'cover',height: '100vh', objectPosition: 'left' ,backgroundColor: '#ADD8E6'}} />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ResetEmail;
