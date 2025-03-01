import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [progress, setProgress] = useState(20);
  const [increasing, setIncreasing] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  
  // Nike facts in Hebrew
  const nikeFacts = [
    "נייקי נוסדה בשנת 1964 תחת השם 'Blue Ribbon Sports'",
    "הלוגו המפורסם של נייקי נקרא 'Swoosh' ועוצב ב-1971",
    "השם 'נייקי' לקוח מאלת הניצחון ביוונית העתיקה",
    "הסלוגן 'Just Do It' הושק בשנת 1988",
    "מייקל ג'ורדן, השחקן הגדול בכל הזמנים, חתם עם נייקי ב-1984",
    "נייקי מוכרת יותר מ-900 מיליון מוצרים בשנה ברחבי העולם",
    "נייקי מעסיקה למעלה מ-75,000 עובדים ברחבי העולם",
    "האתלט הראשון שחתם על חוזה עם נייקי היה רץ המרתון סטיב פרפונטיין",
    "נעלי האייר ג'ורדן הראשונות יצאו בשנת 1985",
    "המטה הראשי של נייקי ממוקם בביברטון, אורגון, ארה\"ב",
    "בשנת 2003 נייקי רכשה את חברת קונברס",
    "כל יום נמכרים יותר מ-120 מיליון זוגות נעליים של נייקי",
    "הסניקרס הכי נמכר של נייקי הוא ה-Air Force 1",
    "הטכנולוגיה הראשונה של נייקי אייר פותחה על ידי מהנדס אווירונאוטיקה"
  ];

  // Animation effect for the progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (increasing) {
        setProgress(prev => {
          if (prev >= 90) {
            setIncreasing(false);
            return 90;
          }
          return prev + 2;
        });
      } else {
        setProgress(prev => {
          if (prev <= 20) {
            setIncreasing(true);
            return 20;
          }
          return prev - 2;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [increasing]);

  // Rotate through Nike facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % nikeFacts.length);
    }, 4000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="text-center py-10 px-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="mb-6">
        <svg className="w-16 h-16 mx-auto mb-2 text-blue-600" viewBox="0 0 50 50" fill="currentColor">
          <path d="M45.4,14.5c-5.3,0-10.6,1-15.4,3.1C25.2,20,20.5,23,16.1,26.4c-4.3,3.3-8.2,7-11.5,11.1c-1.7,2.1-3.1,4.4-4,6.8
            c-0.8,2.1-0.5,4.1,0.8,5.9c1.1,1.6,2.7,2.6,4.6,2.9c0.5,0.1,1,0.1,1.4,0.1c2.7,0,5.3-1.1,7.7-3.4c1.6-1.6,3-3.5,4.2-5.5
            c1.6-2.8,2.8-5.8,3.8-8.9c1.2-4.2,2-8.6,2.2-13c8.7-3.5,18.4-4.2,24.7-1.7c2,0.8,3.5,1.9,4.2,3.3c0.6,1.2,0.4,2.5-0.4,4
            c-1.1,1.9-2.8,3.5-4.9,4.5c-1.7,0.9-3.7,1.2-5.7,1c0.2-0.5,0.4-1.1,0.6-1.6c0.8-2.4,1.5-4.8,2-7.3c0.3-1.5,0.3-2.9-0.1-4.3
            c-0.3-1.2-0.9-2.3-1.8-3.2c-1-1-2.3-1.7-3.6-2.1c-1.2-0.4-2.4-0.5-3.7-0.5c-3.1,0-6.3,0.9-9.1,2.4c-3.3,1.7-6.2,4.1-8.6,7
            c-2.4,2.9-4.3,6.3-5.7,9.9c-1.3,3.5-2.1,7.2-2.4,10.9c0,0.3,0,0.6,0,0.9L0,44.9c0.2-0.3,0.4-0.6,0.6-0.9c3-4.4,6.7-8.4,10.7-11.9
            c4.1-3.6,8.7-6.8,13.6-9.3c5-2.5,10.3-4.2,15.8-5c1.7-0.2,3.4-0.4,5.2-0.4c3.6,0,7.2,0.7,10.4,2.2c3,1.4,5.5,3.6,7,6.3
            c1.5,2.5,1.9,5.4,1.1,8.2c-0.8,3-2.6,5.7-5.2,7.7c-2.6,2-5.8,3.3-9.2,3.7c-1.2,0.1-2.5,0.2-3.7,0.2c-4.8,0-9.6-1-14-2.8
            c-0.3-0.1-0.7-0.2-1-0.4c0.2-1,0.5-2,0.8-2.9c0.7-2.2,1.6-4.3,2.7-6.3c-0.2,1.4-0.3,2.8-0.3,4.1c0,1.2,0.1,2.5,0.3,3.7
            c0.2,1.2,0.5,2.4,1,3.5c0.6,1.4,1.5,2.7,2.7,3.7c1.4,1.2,3.2,2,5,2.3c1.5,0.3,3,0.4,4.5,0.3c3.7-0.2,7.2-1.4,10.2-3.4
            c3-2,5.3-4.8,6.6-8c1.3-3.1,1.4-6.5,0.3-9.7c-1.1-3.2-3.3-6-6.3-8.1C54.5,15.6,50,14.5,45.4,14.5L45.4,14.5z"/>
        </svg>
        <h2 className="text-xl font-bold text-gray-800">טוען...</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4 min-h-[3rem] flex items-center justify-center">
          {nikeFacts[factIndex]}
        </p>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded-full mx-auto overflow-hidden w-full max-w-sm">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 italic">
          אם יונתן היה מוכן לשלם על שרת זה היה מהיר יותר
        </p>
      </div>
    </div>
  );
};

export default Loading;