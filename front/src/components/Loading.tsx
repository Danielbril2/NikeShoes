import React from 'react';

const Loading = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <p className="text-gray-600 mb-3">אם יונתן היה מוכן לשלם על שרת זה היה מהיר יותר</p>
      <div className="relative h-4 w-64 bg-gray-200 rounded-full mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default Loading;