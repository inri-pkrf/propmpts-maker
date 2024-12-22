import React, { useEffect, useState } from 'react';
import '../componentsCSS/PromptMaker.css';

const PromptMaker = () => {
  const [allValues, setAllValues] = useState({});
  const [prompt, setPrompt] = useState('');

  // פונקציה לחילוץ המידע מתוך sessionStorage
  const extractKeys = (obj) => {
    let result = {};
  
    Object.keys(obj).forEach(key => {
      const value = obj[key];
  
      if (typeof value === 'object' && value !== null) {
        // אם הערך הוא אובייקט, נפנה אליו רקורסיבית
        const extracted = extractKeys(value);
        if (Object.keys(extracted).length > 0) {
          result[key] = extracted; // נשמור את האובייקט המומלץ
        }
      } else if (value === true) {
        // אם הערך הוא true, נשמור את המפתח כערך מסוג סטרינג
        result[key] = key;
      } else {
        // אם הערך אינו true, נשמור את הערך
        result[key] = value;
      }
    });
  
    return result;
  };

  // פונקציה להמיר ערכים למחרוזת בצורה דינמית
  const getFormattedValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", "); // אם הערך הוא מערך, מחברים את הערכים עם פסיקים
    } else if (typeof value === 'object' && value !== null) {
      // אם הערך הוא אובייקט, נרוץ על ערכי האובייקט ונחבר את כולם
      let formatted = '';
      Object.entries(value).forEach(([key, nestedValue]) => {
        formatted += `${nestedValue}, `;
      });
      return formatted.slice(0, -2); // מסירים פסיק נוסף בסוף
    }
    return value || "לא נבחר"; // אם הערך לא קיים, נחזיר "לא נבחר"
  };
  
  // פונקציה לחלק הראשון של ההתרגיל
  const buildFullPrompt = (values) => {
    return `
      <p>ההתרגיל יתבצע ברשות אשר מאופיינת ב- <span style="color: green;">${getFormattedValue(values["partOne"]?.["מאפייני הרשות"]) || "לא נבחר"}</span>. 
      אוכלוסיית הרשות מכילה בתוכה <span style="color: green;">${getFormattedValue(values["partOne"]?.["אוכלוסיה"]) || "לא נבחר"}</span>. 
      הרשות נמצאת ב<span style="color: green;">${getFormattedValue(values["partOne"]?.["אזור בארץ"]) || "לא נבחר"}</span>, 
      עם כיווני גישה מ- <span style="color: green;">${getFormattedValue(values["partOne"]?.["כיווני גישה"]) || "לא נבחר"}</span>. 
      הדרכים ברשות הינן <span style="color: green;">${getFormattedValue(values["partOne"]?.["דרכים ברשות"]) || "לא נבחר"}</span> 
      וצירי הגישה לרשות הם <span style="color: green;">${getFormattedValue(values["partOne"]?.["צירי גישה לרשות"]) || "לא נבחר"}</span>. 
      תחבורה ברשות כוללת <span style="color: green;">${getFormattedValue(values["partOne"]?.["תחבורה ברשות"]) || "לא נבחר"}</span>.</p>
        <p>סוג מצב החירום הוא <span style="color: green;">${getFormattedValue(values["partTwo"]?.["סוג_מצב_חירום"]) || "לא נבחר"}</span>, 
      והאיומים על הרשות הם <span style="color: green;">${getFormattedValue(values["partTwo"]?.["איומים_על_הרשות"]) || "לא נבחר"}</span>. 
      אתגרים במהלך התרגיל כוללים <span style="color: green;">${getFormattedValue(values["partTwo"]?.["אתגרים"]) || "לא נבחר"}</span>.</p>
       <p>מי שמגיע לאימון הם <span style="color: green;">${getFormattedValue(values["partThree"]?.["מי מגיע לאימון"]) || "לא נבחר"}</span>, 
      ובמהלך האימון נתמקד ב- <span style="color: green;">${getFormattedValue(values["partThree"]?.["מה מתרגלים"]) || "לא נבחר"}</span>. 
      האימון יתבצע ב- <span style="color: green;">${getFormattedValue(values["partThree"]?.["איפה מתרגלים"]) || "לא נבחר"}</span>, 
      כאשר לא ניתן להביא אמצעים בעת התרגול: <span style="color: green;">${getFormattedValue(values["partThree"]?.["איך מתרגלים"]) || "לא נבחר"}</span>.</p>
       <p>טווחי הזמן במהלך התרגיל הם <span style="color: green;">${getFormattedValue(values["partFour"]?.["טווחי זמן"]) || "לא נבחר"}</span>, 
      כאשר קפיצות הזמן יכללו <span style="color: green;">${getFormattedValue(values["partFour"]?.["קפיצות זמן"]) || "לא נבחר"}</span>. 
      מאפייני החירום במהלך התרגיל כוללים <span style="color: green;">${getFormattedValue(values["partFour"]?.["מאפייני החירום"]) || "לא נבחר"}</span>. 
      הרגשות הצפויים הם <span style="color: green;">${getFormattedValue(values["partFour"]?.["רגשות"]) || "לא נבחר"}</span>.</p>
       <p>שעת התרגול תהיה <span style="color: green;">${getFormattedValue(values["partFive"]?.["שעה_ועונה"]) || "לא נבחר"}</span>, 
      בעונה של <span style="color: green;">${getFormattedValue(values["partFive"]?.["עונות"]) || "לא נבחר"}</span> 
      עם תנאי מזג אוויר של <span style="color: green;">${getFormattedValue(values["partFive"]?.["תנאי_חום_ומזג_אוויר"]) || "לא נבחר"}</span>. 
      מטרות והישגים במהלך התרגיל כוללים <span style="color: green;">${getFormattedValue(values["partFive"]?.["מטרות_והישגים"]) || "לא נבחר"}</span>. 
      התחושות צפויות להיות של <span style="color: green;">${getFormattedValue(values["partFive"]?.["תחושות"]) || "לא נבחר"}</span>.</p>
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
    
    // הדפסת האובייקט המומלץ
    console.log(JSON.stringify(allExtractedValues, null, 2));
  
    setAllValues(allExtractedValues); // עדכון הסטייט עם הערכים
  }, []);

  useEffect(() => {
    // לאחר שהסטייט עדכן, נבנה את הפסקה
    if (Object.keys(allValues).length > 0) {
      const promptText = buildFullPrompt(allValues);
      setPrompt(promptText); // עדכון הפסקה
    }
  }, [allValues]);

  return (
    <div className="promptMaker-container">
      <h1>פרומפט סיפורי</h1>
      <div className="story" dangerouslySetInnerHTML={{ __html: prompt }} />
    </div>
  );
};

export default PromptMaker;
