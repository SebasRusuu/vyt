import React, { useContext, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/MiniVerde.png';
import './header.css';
import NewTask from '../NewTask';
import { AuthContext } from '../../context/AuthContext';
import * as bootstrap from 'bootstrap';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const offcanvasRef = useRef<HTMLDivElement>(null);

    const removeBurgerFocus = () => {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) {
            (toggler as HTMLElement).blur();
            toggler.setAttribute('tabindex', '-1');
        }
    };

    const closeOffcanvas = () => {
        if (offcanvasRef.current) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasRef.current);
            if (offcanvas) {
                offcanvas.hide();
            }
        }
        removeBurgerFocus();
        // Remove manualmente o overlay da shadowbox
        const overlay = document.querySelector('.offcanvas-backdrop');
        if (overlay) {
            overlay.remove();
        }
    };

    const handleCreateTaskClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setTaskModalOpen(true);
            closeOffcanvas();
        }
    };

    const handleLogoutClick = () => {
        logout();
        closeOffcanvas();
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        closeOffcanvas();
    };

    return (
        <>
            <header className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand" style={{ padding: '10px', fontSize: '25px' }}>
                        <img src={logo} alt="VyT" style={{ height: '50px', paddingRight: '10px' }} />
                        VyT
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#navbarOffcanvasLg"
                        aria-controls="navbarOffcanvasLg"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="offcanvas offcanvas-end"
                        tabIndex={-1}
                        id="navbarOffcanvasLg"
                        aria-labelledby="navbarOffcanvasLgLabel"
                        ref={offcanvasRef}
                    >
                        <div className="offcanvas-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                                onClick={removeBurgerFocus}
                            ></button>
                        </div>
                        <div className="offcanvas-body container">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 gap-3">
                                <li className="nav-item">
                                    {user ? (
                                        <>
                                            <span className="nav-link">Olá, {user}</span>
                                            <span className="nav-link" onClick={handleLogoutClick}>
                                                Logout
                                            </span>
                                        </>
                                    ) : (
                                        <Link to="/login" className="nav-link">
                                            Login
                                        </Link>
                                    )}
                                </li>
                                <li className="nav-item" style={{ paddingTop: '5px' }}>
                                    <span
                                        className="nav-link"
                                        onClick={handleCreateTaskClick}
                                        style={{
                                            backgroundColor: '#3aafae',
                                            borderRadius: '20px',
                                            padding: '3px 15px',
                                            color: '#FFFFFF',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Criar Nova Tarefa
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <NewTask isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} />
        </>
    );
}

export default Header;