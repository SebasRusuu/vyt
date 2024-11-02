import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Offcanvas } from 'bootstrap';
import moon from '../../assets/icons/moon.svg';
import profile from '../../assets/icons/profile.svg';
import './header.css';

function Header() {
    const navigate = useNavigate();

    // Initialize off-canvas manually
    useEffect(() => {
        const offcanvasElement = document.getElementById('navbarOffcanvasLg');
        if (offcanvasElement) {
            new Offcanvas(offcanvasElement);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header className="navbar navbar-expand-lg bg-body-tertiary">
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
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">VyT</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                    <img src={profile} alt="Profile icon" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="">
                                    <img src={moon} alt="Toggle dark mode icon" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleLoginClick}>
                                    Login
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
