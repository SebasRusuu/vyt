import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Offcanvas } from 'bootstrap';

import './header.css';

function Header() {
    const navigate = useNavigate();

    useEffect(() => {
        const offcanvasElement = document.getElementById('navbarOffcanvasLg');
        if (offcanvasElement) {
            new Offcanvas(offcanvasElement);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleCreateTaskClick = () => {
        navigate('/create-task');
    }

    return (
        <header className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">VyT</Link>
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
                    <div className="offcanvas-body container" >
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <div className="navbar-nav justify-content-end flex-grow-1 pe-3 me-3">
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleProfileClick}>Profile</span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleLoginClick}>Login</span>
                            </li>
                            </div>
                            <li className="nav-item">
                                <span 
                                    className="nav-link" 
                                    onClick={handleCreateTaskClick}
                                    style={{backgroundColor: "#f8f8", borderRadius: "20px",padding: "7px 15px"}}
                                    
                                    >
                                        Create Task
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
