import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../componentsCSS/Intro.css';

const Intro = () => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [videoSrc, setVideoSrc] = useState(`${process.env.PUBLIC_URL}/assets/media/introVid.mp4`); // Default to introVid
  const navigate = useNavigate(); // Initialize useNavigate

  // Update video source based on screen size
  const updateVideoSource = () => {
    if (window.innerWidth <= 768) {
      setVideoSrc(`${process.env.PUBLIC_URL}/assets/media/introVid.mp4`);
    } else {
      console.log("compsize")
      setVideoSrc(`${process.env.PUBLIC_URL}/assets/media/introVidComp.mp4`);
    }
  };

  useEffect(() => {
    // Set the initial video source based on screen width
    updateVideoSource();

    // Add event listener for window resize to update video source dynamically
    const resizeListener = () => {
      updateVideoSource();
    };
    window.addEventListener('resize', resizeListener);

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
      window.removeEventListener('resize', resizeListener); // Cleanup on component unmount
    };
  }, []); // Empty dependency array to run only once on mount

  const skipVideo = () => {
    setIsVideoEnded(true);
    setShowIntro(true);
  };

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div id="intro-lomda">
      {!isVideoEnded && (
        <>
          {showSkipButton && (
            <button className="skip" onClick={skipVideo}>
              &lt;&lt; דלג/י
            </button>
          )}
          <video className="video-intro" autoPlay muted playsInline>
            <source src={videoSrc} type="video/mp4" />
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
          <h1 id="welcome-text">  מחולל פרומפטים </h1>
          <p id="introduction">
ברוכים וברוכות הבאים למחולל הפרומפטים כאן תוכלו ליצור תרגיל לשעת חירום על מנת לאמן רשויות           </p>
          <img
            src={`${process.env.PUBLIC_URL}/assets/imgs/whiteNextBtn.png`}
            className="hpArrow-intro"
            alt="Arrow"
            onClick={goToHome} // Call goToHome on click
          />
        </div>
      )}
    </div>
  );
};

export default Intro;
