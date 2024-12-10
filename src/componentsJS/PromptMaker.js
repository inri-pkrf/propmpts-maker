import React, { useEffect, useState } from 'react';

const PromptMaker = () => {
  const [allValues, setAllValues] = useState([]);
  const [prompt, setPrompt] = useState('');

  // פונקציה לחילוץ המידע מתוך sessionStorage
  const extractKeys = (obj) => {
    let values = [];
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (typeof value === 'object') {
        // אם הערך הוא אובייקט או מערך, נפנה אליהם רקורסיבית
        values = values.concat(extractKeys(value));
      } else if (value === true) {
        // אם הערך הוא true, נשמור רק את המפתח
        values.push(key);
      } else {
        // אם הערך לא true, נשמור אותו
        values.push(value);
      }
    });
    return values;
  };

  // פונקציה לבניית פסקה מתוך המידע שנחילץ
  const buildPrompt = (values) => {
    // בניית הפסקה עם כל הערכים שנחולצו
    return `
    ההתרגיל יתבצע ברשות של סוג: <span style="color: green;">${values[0]}</span> הכוללת <span style="color: green;">${values[1]}</span>. 
    התרחיש יתמקד בהגנה על האוכלוסייה, במיוחד קבוצות גיל: <span style="color: green;">${values[2]}</span>.
    באזור שנבחר, כגון <span style="color: green;">${values[3]}</span> עם גישה מ-<span style="color: green;">${values[4]}</span> והדרכים העיקריות הן: <span style="color: green;">${values[5]}</span>. 
    במהלך התרגיל, נתרגל התמודדות עם מצבי חירום כמו <span style="color: green;">${values[6]}</span>, עם אתגרים כמו <span style="color: green;">${values[7]}</span>. 
    המטרה היא לבצע תרגול מערך מבצעים ולהתמקד בסוגי אימונים כמו <span style="color: green;">${values[8]}</span> באזורים כמו <span style="color: green;">${values[9]}</span>. 
    שעת התרגול תהיה <span style="color: green;">${values[10]}</span> בעונה של <span style="color: green;">${values[11]}</span> עם תנאי מזג אוויר של <span style="color: green;">${values[12]}</span>.
  `;
  };

  useEffect(() => {
    // בדיקה אם הנתונים קיימים ב-sessionStorage
    const storedValues = sessionStorage.getItem('selectedValues');
    if (!storedValues) {
      console.log('No session data found');
      return;
    }

    const parsedValues = JSON.parse(storedValues);

    // חילוץ כל הערכים
    const allExtractedValues = extractKeys(parsedValues);
    
    // הדפסת המערך שנחולץ ב-console
    console.log('Extracted Values:', allExtractedValues);

    setAllValues(allExtractedValues); // עדכון הסטייט עם הערכים
  }, []);

  useEffect(() => {
    // לאחר שהסטייט עדכן, נבנה את הפסקה
    if (allValues.length > 0) {
      const promptText = buildPrompt(allValues);
      setPrompt(promptText); // עדכון הפסקה
    }
  }, [allValues]);

  return (
    <div className="Menupage-container">
      <h1>פרומפט סיפורי</h1>
      <p dangerouslySetInnerHTML={{ __html: prompt }} />
    </div>
  );
};

export default PromptMaker;
