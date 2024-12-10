import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../componentsCSS/Header.css';
// import Hamburger from '../componentsJS/Hamburger';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // בודק אם המסלול הוא "/iron-swords-college" ומחלק את התמונה לפי זה
 

  return (
    <header className="header">
      {/* <Hamburger className="hamburger"/> */}
      
      <img
        src={`${process.env.PUBLIC_URL}/assets/imgs/collegeLogo.png`}
        className="App-logo"
        alt="logo"
      />
      
      <button
        className="back-homeNav"
        onClick={() => navigate('/home')} // ניווט לעמוד הבית
      >
      </button>

      <img
        src={`${process.env.PUBLIC_URL}/assets/imgs/orange.png`}
        alt="Decorative"
        className="decorative-photo"
      />
    </header>
  );
}

export default Header;
