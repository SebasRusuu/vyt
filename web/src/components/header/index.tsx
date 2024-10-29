import React from 'react'
import  moon  from '../../assets/icons/moon.svg'
import profile from '../../assets/icons/profile.svg'

function header() {
  return (
    <header className= "">
        <div className= "branding">
            
        </div>
        <div className="buttons">
            <button>
                <p>Create a new task</p>
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

export default header