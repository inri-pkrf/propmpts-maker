import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import training from '../data/training.json'; // נתיב לקובץ ה-JSON שלך
import '../componentsCSS/Parts.css';

const PartFour = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({}); // הוספת משתנה למעקב אחרי הקטגוריות המורחבות
  const jsonData = training; // קריאה מה-JSON
  const navigate = useNavigate();

  // קריאה מ-sessionStorage כאשר הרכיב נטען
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      setSelectedValues(JSON.parse(storedValues).partFour || {}); // טוען את נתוני PartFour בלבד
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
    now.setHours(now.getHours() + hours); // מוסיף שעות
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hoursStr}:${minutes}`;
  };

  const getTimePlusDays = (days) => {
    const now = new Date();
    now.setDate(now.getDate() + days); // מוסיף ימים
    return now.toLocaleDateString('he-IL'); // מחזיר את התאריך החדש בפורמט עברי
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

    // עדכון ה-sessionStorage, שמירה על הערכים הקודמים של כל השלבים
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
    allStoredValues.partFour = newState;  // עדכון רק של PartFour
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
  };

  // פונקציה לניהול הבחירות בדרופ-דאון
  const handleDropdownChange = (category, value) => {
    const newState = { ...selectedValues, [category]: value };
    setSelectedValues(newState);

    // עדכון ה-sessionStorage, שמירה על הערכים הקודמים של כל השלבים
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
    allStoredValues.partFour = newState;  // עדכון רק של PartFour
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
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

  // פונקציה לניהול התפשטות קטגוריה
  const toggleCategory = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <div className="part-container">
      <h1 className="Part-title">04 הגדרת מאפייני האימון      </h1>
      <div className="user-Selections">
        {Object.keys(jsonData).map((category, index) => (
          <div key={category} className={`category-container category-${index}`}>
            <div
              className="category-header"
              onClick={() => toggleCategory(category)} // כעת הכותרת והחץ גם יחד מקבלים את האירוע
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <h3 style={{ marginRight: '8px' }}>{category}</h3>
              {/* החץ מוצג רק אם מדובר בקטגוריה עם אובייקט (צ'ק בוקסים) */}
              {typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category]) && (
                <img
                  src={`${process.env.PUBLIC_URL}/assets/imgs/nextBlack.png`}
                  alt="Toggle"
                  className={`chevron ${expandedCategories[category] ? 'expanded' : ''}`}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              )}
            </div>
            {typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category]) && expandedCategories[category] && (
              <div className="checkbox-group">
                {Object.keys(jsonData[category]).map((subCategory) => (
                  <div key={subCategory} className="checkbox-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedValues[category]?.[subCategory] || false}
                        onChange={() => handleCheckboxChange(category, subCategory)}
                      />
                      {subCategory}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {Array.isArray(jsonData[category]) && (
              <div className="dropdown-group">
                <select
                  value={selectedValues[category] || ''}
                  onChange={(e) => handleDropdownChange(category, e.target.value)}
                >
                  <option value="">בחרו</option>
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
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="selected-info">
        <h2 className="selsected-title">הבחירות שלך:</h2>
        <p>{renderSelectedValues()}</p>
        <button
          className="button-go"
          onClick={handleNextStep}
          disabled={!isAllSelected()}
        >
          המשך
        </button>
      </div>
    </div>
  );
};

export default PartFour;
