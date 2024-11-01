import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import moon from '../../assets/icons/moon.svg';
import profile from '../../assets/icons/profile.svg';

function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#DCDCDC" }}>
                <div className="container">
                    <Link to="/" className="navbar-brand">VyT</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className='ms-auto col'>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">
                                    <img src={profile} alt="Profile icon" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <img src={moon} alt="Toggle dark mode icon" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={handleLoginClick}>
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <nav data-mdb-sidenav-init className="sidenav" data-mdb-right="true">
            </nav>
        </header>
    );
}

export default Header;
