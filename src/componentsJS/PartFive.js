import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import goals from '../data/goals.json';
import '../componentsCSS/Parts.css';

const PartFive = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const jsonData = goals;
  const navigate = useNavigate();

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
    <div className="part-container">
      <h1 className="Part-title"> 05 מטרות האימון</h1>
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

export default PartFive;
