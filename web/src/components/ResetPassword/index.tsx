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
import teste from '../../assets/teste4.png';

function ResetPassword() {
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    // Lógica de redefinição de senha no backend pode ser adicionada aqui

    navigate('/login'); // Redireciona para a página de login após redefinir a senha
  };
  const onClose = () => {
    navigate('/login');
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
        <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
            style={{
            position: 'absolute',
            top: '10px',
            left: '10px'
            }}
        ></button>
          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Set New Password</h3>

            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='New Password' id='newPassword' type='password' size="lg" />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Confirm New Password' id='confirmNewPassword' type='password' size="lg" />

            <MDBBtn
              className="mb-4 px-5 mx-5 w-100"
              color='info'
              size='lg'
              onClick={handlePasswordReset}
            >
              Reset Password
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

export default ResetPassword;
