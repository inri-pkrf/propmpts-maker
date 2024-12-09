import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PromptMaker = () => {
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState({});

  // קריאה מה-sessionStorage כדי לשלוף את הבחירות של המשתמש
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      console.log("Loaded selected values:", parsedValues);  // הדפסת הערכים כדי לבדוק
      setSelectedValues(parsedValues);
    } else {
      console.log("No data found in sessionStorage");
    }
  }, []);
  
  // פונקציה להחזרת צבע ירוק רק אם יש ערך
  const getHighlightedText = (value) => value ? `<span style="color: green;">${value}</span>` : value;

  const generateStory = () => {
    const { partOne = {}, partTwo = {}, partFour = {}, partFive = {} } = selectedValues;
    const { מאפייני_הרשות, אוכלוסיה, אזור_בארץ, כיווני_גישה, דרכים_ברשות, תחבורה_ברשות } = partOne;
    const { סוג_מצב_חירום, איומים_על_הרשות, אתגרים } = partTwo;
    const { טווחי_זמן, קפיצות_זמן, מאפייני_חירום, רגשות, שעה_ועונה, עונות, תאורה, תנאי_חום_ומזג_אוויר } = partFour;
    const { מטרות_והישגים, תחושות } = partFive;
  
    return `
      התרגיל יתבצע ברשות ${getHighlightedText(מאפייני_הרשות?.עיר || '______________')} הכוללת ${getHighlightedText(מאפייני_הרשות?.רבי_קומות || '______________')}.
      התרחיש יתמקד ב${getHighlightedText(סוג_מצב_חירום || '______________')} שהוביל/ו ל${getHighlightedText(איומים_על_הרשות || '______________')}.
      במסגרת התרגיל ישולבו ${getHighlightedText(אתגרים || '______________')}.
      מטרות התרגיל הן ${getHighlightedText(מטרות_והישגים?.איסוף_מידע || '______________')}.
      התרגיל יתקיים בתנאים של ${getHighlightedText(תנאי_חום_ומזג_אוויר || '______________')}, עם תאורה ${getHighlightedText(תאורה || '______________')}, והשעה היא ${getHighlightedText(שעה_ועונה || '______________')}.
      התרגיל יתקיים באזור ${getHighlightedText(אזור_בארץ || '______________')}, עם דרכים ברשות כגון ${getHighlightedText(דרכים_ברשות || '______________')} והגישה למקום תהיה דרך כיווני גישה ${getHighlightedText(כיווני_גישה || '______________')}.
      התחבורה ברשות כוללת ${getHighlightedText(תחבורה_ברשות || '______________')}.
      התרגיל יכיל אלמנטים של פחד.
      תחושות של העצמה יילקחו בחשבון במהלך התרגיל.
      התרגיל יתקיים בעונת אביב.
    `;
  };
  
  // פונקציה להעתקת הפסקה ללוח
  const handleCopy = () => {
    const story = generateStory();
    navigator.clipboard.writeText(story);
    alert('הפסקה הועתקה ללוח');
  };

  // פונקציה להחזרה להתחלה ו-CLEAR של ה-sessionStorage
  const handleRestart = () => {
    sessionStorage.clear();
    navigate('/step1');
  };

  return (
    <div className="Menupage-container">
      <h1>פרומפט סיפורי</h1>
      <p dangerouslySetInnerHTML={{ __html: generateStory() }} />
      <div>
        <button onClick={handleCopy}>העתק פסקה</button>
        <button onClick={handleRestart}>חזרה להתחלה</button>
      </div>
    </div>
  );
};

export default PromptMaker;
