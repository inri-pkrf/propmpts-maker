import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import '../componentsCSS/Intro.css';

const Intro = () => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const videoEndTimeout = setTimeout(() => {
      setIsVideoEnded(true);
    }, 13000); // Duration until the video is considered ended

    const introTextTimeout = setTimeout(() => {
      setShowIntro(true);
    }, 13050); // Show intro text shortly after video ends

    const skipButtonTimeout = setTimeout(() => {
      setShowSkipButton(true);
    }, 3500); // Show the skip button after 3.5 seconds

    return () => {
      clearTimeout(videoEndTimeout);
      clearTimeout(introTextTimeout);
      clearTimeout(skipButtonTimeout);
    };
  }, []);

  const skipVideo = () => {
    setIsVideoEnded(true);
    setShowIntro(true);
  };

  const goToHome = () => {
    navigate('/home'); 
  };

  return (
    <div id="intro-lomda">
      <h1>פתיח </h1>
      {/* {!isVideoEnded && (
        <>
          {showSkipButton && (
            <button className="skip" onClick={skipVideo}>
              &lt;&lt; דלג/י
            </button>
          )}
          <video className="video-intro" autoPlay muted playsInline>
            <source src={`${process.env.PUBLIC_URL}/assets/media/introVid.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
      {showIntro && (
        <div className="intro-text-slide-in">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/imgs/whiteLogo.svg`} 
            alt="White Logo" 
            id="logo-white" 
            className="move-to-center" 
          />
             <h1 id="welcome-text"> החברה הישראלית
             </h1>
             <p id="introduction"> ברוכים הבאים והבאות לשיעור הדיגיטלי על רבדי החברה הישראלית, או - כל מה שרציתם לדעת ולא העזתם לשאול על החברה החרדית, הערבית, קשישים ואנשים עם מוגבלויות
            </p>
          <img
            src={`${process.env.PUBLIC_URL}/assets/imgs/whiteNextBtn.png`}
            className="hpArrow-intro"
            alt="Arrow"
            onClick={goToHome} // Call goToHome on click
          />
        </div>
      )} */}
    </div>
  );
};

export default Intro;
