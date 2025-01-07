import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/MiniVerde.png';
import './header.css';
import NewTask from '../NewTask';
import { AuthContext } from '../../context/AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext); // Usando o AuthContext
    const navigate = useNavigate();
    const [isTaskModalOpen, setTaskModalOpen] = useState(false); // Estado para o modal de tarefas

    const handleCreateTaskClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setTaskModalOpen(true); // Abrir o modal
        }
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false); // Fechar o modal
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
                    >
                        <div className="offcanvas-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="offcanvas-body container">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 gap-3">
                                <li className="nav-item">
                                    {user ? (
                                        <>
                                            <span className="nav-link">Olá, {user}</span>
                                            <span className="nav-link" onClick={logout}>
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
