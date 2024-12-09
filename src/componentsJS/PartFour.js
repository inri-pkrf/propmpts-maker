import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import training from '../data/training.json'; // נתיב לקובץ ה-JSON שלך
import '../componentsCSS/Parts.css';

const PartFour = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const jsonData = training; // קריאה מה-JSON
  const navigate = useNavigate();

  // קריאה מ-sessionStorage כאשר הרכיב נטען
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      setSelectedValues(JSON.parse(storedValues).partFour || {});
    }
  }, []);

  // פונקציות חישוב זמן
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getTimePlus = (hours) => {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hoursStr}:${minutes}`;
  };

  const getTimePlusDays = (days) => {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now.toLocaleDateString('he-IL');
  };

  // יצירת רשימת טווחי זמן עם הזמן הנוכחי
  const timeRanges = [
    "מעמ\"ל",
    getCurrentTime(), // T-0 - זמן נוכחי
    getTimePlus(5),   // T+5 - זמן נוכחי + 5 שעות
    getTimePlus(12),  // T+12
    getTimePlus(24),  // T+24
    getTimePlus(48),  // T+48
    getTimePlusDays(7), // T-שבוע (תאריך 7 ימים קדימה)
    getTimePlusDays(14), // T-שבועיים (תאריך 14 ימים קדימה)
    getTimePlusDays(182) // T-חצי שנה (תאריך 182 ימים קדימה)
  ];

  // פונקציה לניהול הבחירות בצ'ק-בוקסים
  const handleCheckboxChange = (category, subCategory) => {
    const newState = {
      ...selectedValues,
      [category]: {
        ...selectedValues[category],
        [subCategory]: !selectedValues[category]?.[subCategory]
      }
    };

    setSelectedValues(newState);
    sessionStorage.setItem('selectedValues', JSON.stringify({ ...selectedValues, partFour: newState }));
  };

  // פונקציה לניהול הבחירות בדרופ-דאונים
  const handleDropdownChange = (category, value) => {
    const newState = { ...selectedValues, [category]: value };
    setSelectedValues(newState);
    sessionStorage.setItem('selectedValues', JSON.stringify({ ...selectedValues, partFour: newState }));
  };

  // פונקציה להמיר את הבחירות לפסקה
  const renderSelectedValues = () => {
    let result = [];
    Object.keys(selectedValues).forEach(category => {
      const categoryValue = selectedValues[category];
      if (typeof categoryValue === 'object') {
        Object.keys(categoryValue).forEach(subCategory => {
          if (categoryValue[subCategory]) {
            result.push(`${subCategory}: נבחר`);
          }
        });
      } else if (categoryValue) {
        result.push(`${category}: ${categoryValue}`);
      }
    });
    return result.join('. ');
  };

  // פונקציה לבדיקת אם הכל נבחר
  const isAllSelected = () => {
    // בודק שכל קטגוריה נבחרה
    return Object.keys(jsonData).every(category => {
      const categoryValue = selectedValues[category];

      // אם הקטגוריה היא מערך (כמו טווחי זמן)
      if (Array.isArray(categoryValue)) {
        return categoryValue.length > 0;  // נבחר לפחות משהו מהמערך
      }

      // אם הקטגוריה היא אובייקט (כמו צ'ק-בוקסים)
      if (typeof categoryValue === 'object') {
        return Object.values(categoryValue).some(val => val);  // לפחות אחד מהם נבחר
      }

      // אם הקטגוריה היא ערך יחיד
      return categoryValue !== undefined && categoryValue !== '';
    });
  };

  // פונקציה להעבר לשלב הבא
  const handleNextStep = () => {
    if (isAllSelected()) {
      navigate('/step5');
    } else {
      alert('נא לבחור לפחות אפשרות אחת מכל קטגוריה');
    }
  };

  return (
    <div className="partFour-container">
      <h1 className="partFour-title">מאפייני תרחיש היחוס</h1>

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
              {/* אם הקטגוריה היא טווחי זמן, נשתמש ב-timeRanges */}
              {category === "טווחי זמן" ? (
                timeRanges.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))
              ) : (
                jsonData[category].map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))
              )}
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
      <div>
        <button
          className="button-go"
          disabled={!isAllSelected()}
          onClick={handleNextStep}
        >
          אשר והמשך
        </button>
      </div>
    </div>
  );
};

export default PartFour;
