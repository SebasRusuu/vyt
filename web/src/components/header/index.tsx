import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import axiosInstance from '../../services/api';

import './header.css';
import NewTask from '../NewTask';

interface DecodedToken {
    user_name: string;
    exp: number;
}

function Header() {
    const navigate = useNavigate();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds
                if (decoded.exp > currentTime) {
                    // Make an API call to validate the token with the backend
                    axiosInstance
                        .get('/user/validate-token', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((response) => {
                            setUserName(decoded.user_name);
                        })
                        .catch((error) => {
                            localStorage.removeItem('token');
                            console.error('Invalid token or user does not exist:', error);
                        });
                } else {
                    localStorage.removeItem('token'); // Remove expired token
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token'); // Remove invalid token
            }
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserName(null);
        navigate('/');
    };

    const handleCreateTaskClick = () => {
        setIsTaskModalOpen(true); // Open the pop-up
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false); // Close the pop-up
    };

    return (
        <>
            <header className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
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
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    {userName ? (
                                        <>
                                            <span className="nav-link">Welcome, {userName}</span>
                                            <span className="nav-link" onClick={handleLogout}>Logout</span>
                                        </>
                                    ):(<span className="nav-link" onClick={handleLoginClick}>Login</span>)}
                                </li>
                                <li className="nav-item">
                  <span
                      className="nav-link"
                      onClick={handleCreateTaskClick}
                      style={{
                          backgroundColor: '#f8f8',
                          borderRadius: '20px',
                          padding: '7px 15px',
                      }}>
                      Create Task
                  </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {/* Include the NewTask component as a pop-up */}
            <NewTask isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} />
        </>
    );
}

export default Header;
