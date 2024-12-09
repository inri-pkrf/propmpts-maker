import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

import '../componentsCSS/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate('/menu'); 
  };
 
  return (
    <div className="homepage-container">
      <h1 className='home-title'>  ברוכים הבאים והבאות   <br></br>למחולל התרגילים

 </h1>
 <p className="info1">
בעזרת מוצר זה תוכלו בקלות ליצור תרגיל לכל תרחיש על מנת לאמן רשויות
 </p>
 
 <button className='home-button' onClick={goToMenu}>קדימה מתחילים</button>


<div className="footer"></div>
    </div>
  );
};

export default Home;