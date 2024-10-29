import React from 'react'
import { useNavigate } from 'react-router-dom';
import  moon  from '../../assets/icons/moon.svg'
import profile from '../../assets/icons/profile.svg'

function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    return (
        <header className= "">
            <div className= "branding">
                
            </div>
            <div className="buttons">
                <button onClick={handleLoginClick}>
                    Iniciar Sessão
                </button>
                <button>
                    <img src={moon} alt="moon"/>
                </button>   
                <button>
                    <img src={profile} alt="profile"/>
                </button>

            </div>
        </header>
    )
}

export default Header