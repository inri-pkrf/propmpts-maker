import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import scenerio from '../data/scenerio.json';
import '../componentsCSS/Parts.css';

const PartTwo = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const jsonData = scenerio;
  const navigate = useNavigate();

  // אתחול ערכים ב- useEffect
  useEffect(() => {
    const storedValues = sessionStorage.getItem('selectedValues');
    if (storedValues) {
      setSelectedValues(JSON.parse(storedValues).partTwo || {}); // נטען רק את הבחירות של PartTwo
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
      const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {}; // קריאה לכל הבחירות
      allStoredValues.partTwo = newState; // עדכון רק של PartTwo
      sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
      return newState;
    });
  };

  // פונקציה לניהול הבחירות בדרופ-דאון
  const handleDropdownChange = (category, value) => {
    const newState = { ...selectedValues, [category]: value };
    setSelectedValues(newState);
    const allStoredValues = JSON.parse(sessionStorage.getItem('selectedValues')) || {}; // קריאה לכל הבחירות
    allStoredValues.partTwo = newState; // עדכון רק של PartTwo
    sessionStorage.setItem('selectedValues', JSON.stringify(allStoredValues)); // שמירה מחדש
  };
  
  // פונקציה לתצוגת קטגוריות
  const toggleCategory = (category) => {
    if (jsonData[category] && typeof jsonData[category] === 'object') {
      setExpandedCategories((prevState) => ({
        ...prevState,
        [category]: !prevState[category],
      }));
    }
  };

  // פונקציה להדפסת ערכים נבחרים
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

  // פונקציה לבדוק אם כל הבחירות בוצעו
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
      navigate('/step3'); // ניווט לעמוד הבא
    } else {
      alert('נא לבחור לפחות אפשרות אחת מכל קטגוריה');
    }
  };


  return (
    <div className="part-container">
      <h1 className="Part-title">02 מאפייני התרחיש</h1>
      <div className="user-Selections">
        {Object.keys(jsonData).map((category, index) => (
          <div key={category} className={`category-container category-${index}`}>
            <div
              className="category-header"
              onClick={() => toggleCategory(category)}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <h3 style={{ marginRight: '8px' }}>{category}</h3>
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

export default PartTwo;
