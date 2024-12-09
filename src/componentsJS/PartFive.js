import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import goals from '../data/goals.json';
import '../componentsCSS/Parts.css';

const PartFive = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const jsonData = goals;
  const navigate = useNavigate();

  // קריאה מ-sessionStorage כאשר הרכיב נטען
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      setSelectedValues(parsedValues.partFive || {}); // נטען רק את הבחירות של PartOne
    }
  }, []);

  // פונקציה לניהול הבחירות בצ'ק-בוקסים
  const handleCheckboxChange = (category, value) => {
    setSelectedValues(prevState => {
      const updatedCategory = prevState[category] ? { ...prevState[category] } : {};
      if (updatedCategory[value]) {
        delete updatedCategory[value];
      } else {
        updatedCategory[value] = true;
      }
      const newState = { ...prevState, [category]: updatedCategory };
      
      // שמירה רק של PartOne בתוך כל הבחירות
      const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
      allStoredValues.partFive = newState;  // עדכון רק של PartOne
      sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
      
      return newState;
    });
  };

  // פונקציה לניהול הבחירות בדרופ-דאון
  const handleDropdownChange = (category, value) => {
    const newState = { ...selectedValues, [category]: value };
    setSelectedValues(newState);
    
    // שמירה רק של PartOne בתוך כל הבחירות
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
    allStoredValues.partOne = newState;  // עדכון רק של PartOne
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
  };

  // פונקציה להמיר את הבחירות לפסקה
  const renderSelectedValues = () => {
    let result = [];
    Object.keys(selectedValues).forEach(category => {
      if (typeof selectedValues[category] === 'object') {
        const selectedOptions = Object.keys(selectedValues[category])
          .filter(option => selectedValues[category][option])
          .join(', ');
        if (selectedOptions) {
          result.push(`${category}: ${selectedOptions}`);
        }
      } else if (selectedValues[category]) {
        result.push(`${category}: ${selectedValues[category]}`);
      }
    });
    return result.join('. ');
  };

  // פונקציה לבדיקת אם הכל נבחר
  const isAllSelected = () => {
    return Object.keys(jsonData).every(category => {
      if (typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category])) {
        return Object.keys(jsonData[category]).some(subCategory => selectedValues[category]?.[subCategory]);
      } else if (Array.isArray(jsonData[category])) {
        return selectedValues[category] !== '';
      }
      return false;
    });
  };

  // פונקציה להעבר לשלב הבא
  const handleNextStep = () => {
    if (isAllSelected()) {
      navigate('/prompt-maker'); // ניווט לעמוד step2 כאשר כל הבחירות נעשו
    } else {
      alert('נא לבחור לפחות אפשרות אחת מכל קטגוריה');
    }
  };

  return (
    <div className="PartOne-container">
      <h1 className='PartOne-title'>מאפייני הרשות</h1>

      {/* יצירת צ'ק-ליסטים ודרופ-דאונים בצורה גנרית */}
      {Object.keys(jsonData).map(category => (
        <div key={category}>
          <h3>{category}</h3>

          {/* אם הקטגוריה מכילה אובייקט (צ'ק-בוקסים) */}
          {typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category]) ? (
            Object.keys(jsonData[category]).map(subCategory => (
              <div key={subCategory}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedValues[category] && selectedValues[category][subCategory] || false}
                    onChange={() => handleCheckboxChange(category, subCategory)}
                  />
                  {subCategory}
                </label>
              </div>
            ))
          ) : null}

          {/* אם הקטגוריה מכילה מערך (דרופ-דאון) */}
          {Array.isArray(jsonData[category]) ? (
            <select
              value={selectedValues[category] || ''}
              onChange={(e) => handleDropdownChange(category, e.target.value)}
            >
              <option value="">בחר</option>
              {jsonData[category].map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ))}

      {/* הצגת הבחירות כטקסט בתוך פסקה */}
      <div className="selected-info">
        <h2>הבחירות שביצעת:</h2>
        <p>{renderSelectedValues()}</p>
      </div>

      {/* כפתור אשר והמשך */}
      <div className='footer'>
        <button
          disabled={!isAllSelected()}  // הכפתור מאופשר רק אם בוצעה לחיצה לפחות אחת מכל מערך
          onClick={handleNextStep} // קריאה לפונקציה שמבצעת ניווט
        >
          אישור ולהמשיך
        </button>
      </div>
    </div>
  );
};

export default PartFive;
