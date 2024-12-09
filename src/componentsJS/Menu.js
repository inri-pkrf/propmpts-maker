import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../componentsCSS/Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate('/menu'); 
  };

  return (
    <div className="Menupage-container">
      <h1 className='Menu-title'>לחצו על השלבים</h1>

      <div className="button-container">
        <button className="menu-button" onClick={() => navigate('/step1')}>שלב 1</button>
        <button className="menu-button" onClick={() => navigate('/step2')}>שלב 2</button>
        <button className="menu-button" onClick={() => navigate('/step3')}>שלב 3</button>
        <button className="menu-button" onClick={() => navigate('/step4')}>שלב 4</button>
        <button className="menu-button" onClick={() => navigate('/step5')}>שלב 5</button>
      </div>

      <div className="footer"></div>
    </div>
  );
};

export default Menu;
