import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import crowd from '../data/crowd.json';
import '../componentsCSS/Parts.css';

const PartThree = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const jsonData = crowd;
  const navigate = useNavigate();
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      setSelectedValues(JSON.parse(storedValues).partThree || {});
    }
  }, []);

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

    // עדכון ה-sessionStorage
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
    allStoredValues.partThree = newState; // עדכון רק של partFour
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
  };

  // פונקציה לניהול הבחירות בדרופ-דאון
  const handleDropdownChange = (category, value) => {
    const newState = { ...selectedValues, [category]: value };
    setSelectedValues(newState);

    // עדכון ה-sessionStorage
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {};
    allStoredValues.partThree = newState;
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
  };

  const toggleCategory = (category) => {
    // רק עבור קטגוריות עם אובייקט (צ'ק בוקסים), לא עבור מערכים
    if (typeof jsonData[category] === 'object' && !Array.isArray(jsonData[category])) {
      setExpandedCategories((prevState) => ({
        ...prevState,
        [category]: !prevState[category],
      }));
    }
  };
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
      navigate('/step4'); 
    } else {
      alert('נא לבחור לפחות אפשרות אחת מכל קטגוריה');
    }
  };

  return (
    <div className="part-container">
      <h1 className="Part-title"> 03 קהל יעד וסוג האימון </h1>
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
                  {jsonData[category].map((item, itemIndex) => (
                    <option key={itemIndex} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="selected-info">
        <h2 className="selsected-title">הבחירות שביצעת:</h2>
        <p>{renderSelectedValues()}</p>
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

export default PartThree;
