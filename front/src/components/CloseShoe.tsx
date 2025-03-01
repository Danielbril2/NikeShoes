import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoeAPI, Shoe, ShoeType } from '../API/RestAPI';

const CloseShoes = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ShoeType | ''>('');
  const [allShoes, setAllShoes] = useState<Shoe[]>([]); // All shoes from the backend
  const [shoes, setShoes] = useState<Shoe[]>([]); // Filtered shoes by type
  const [missingShoes, setMissingShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTypeSelection, setShowTypeSelection] = useState(true);
  const [showMissingList, setShowMissingList] = useState(false);

  // Load all shoes at the beginning
  useEffect(() => {
    const fetchAllShoes = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedShoes = await ShoeAPI.getAllShoes();
        setAllShoes(fetchedShoes);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('נכשל בטעינת נעליים');
      } finally {
        setLoading(false);
      }
    };

    fetchAllShoes();
  }, []);

  // Filter shoes by type locally
  const handleTypeSelect = (type: ShoeType) => {
    setSelectedType(type);
    const filteredShoes = allShoes.filter(shoe => shoe.type === type);
    setShoes(filteredShoes);
    setShowTypeSelection(false);
    setError(null);
  };

  const getHebrewType = (type: ShoeType): string => {
    switch (type) {
      case 'Man':
        return 'גברים';
      case 'Woman':
        return 'נשים';
      case 'Children':
        return 'ילדים';
      default:
        return type;
    }
  };

  const markAsMissing = (shoe: Shoe) => {
    setMissingShoes(prev => [...prev, shoe]);
    setShoes(prev => prev.filter(s => s.code !== shoe.code));
  };

  const markAsExists = (shoe: Shoe) => {
    setShoes(prev => prev.filter(s => s.code !== shoe.code));
  };

  const removeFromMissingList = (shoe: Shoe) => {
    setMissingShoes(prev => prev.filter(s => s.code !== shoe.code));
  };

  const goBackToTypeSelection = () => {
    setShowTypeSelection(true);
    setShowMissingList(false);
    setShoes([]);
    setSelectedType('');
  };

  const viewMissingShoes = () => {
    setShowMissingList(true);
  };

  const backToShoeList = () => {
    setShowMissingList(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">סגירת מלאי</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading indicator with message */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-3">אם יונתן היה מוכן לשלם על שרת זה היה מהיר יותר</p>
          <div className="relative h-4 w-64 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      )}

      {/* Type Selection */}
      {!loading && showTypeSelection && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">בחר קטגוריה לסגירה</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleTypeSelect('Man')}
              className="p-6 border-2 border-blue-500 rounded-lg text-center hover:bg-blue-50 transition-colors"
            >
              <h3 className="text-xl font-bold">גברים</h3>
            </button>
            <button
              onClick={() => handleTypeSelect('Woman')}
              className="p-6 border-2 border-pink-500 rounded-lg text-center hover:bg-pink-50 transition-colors"
            >
              <h3 className="text-xl font-bold">נשים</h3>
            </button>
            <button
              onClick={() => handleTypeSelect('Children')}
              className="p-6 border-2 border-green-500 rounded-lg text-center hover:bg-green-50 transition-colors"
            >
              <h3 className="text-xl font-bold">ילדים</h3>
            </button>
          </div>
        </div>
      )}

      {/* Shoes List for Checking */}
      {!loading && !showTypeSelection && !showMissingList && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">
                בדיקת נעלי {getHebrewType(selectedType as ShoeType)}
              </h2>
              <p className="text-sm text-gray-600">
                מספר נעליים לבדיקה: {shoes.length} | נעליים חסרות: {missingShoes.length}
              </p>
            </div>
            <div className="flex space-x-reverse space-x-2">
              <button
                onClick={goBackToTypeSelection}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                חזרה לבחירת קטגוריה
              </button>
              <button
                onClick={viewMissingShoes}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                disabled={missingShoes.length === 0}
              >
                צפה בנעליים חסרות ({missingShoes.length})
              </button>
            </div>
          </div>

          {shoes.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800">הושלם!</h3>
              <p className="text-green-700 mt-2">
                כל הנעליים בקטגוריה זו נבדקו. נעליים חסרות: {missingShoes.length}
              </p>
              {missingShoes.length > 0 && (
                <button
                  onClick={viewMissingShoes}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  צפה בנעליים חסרות
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shoes.map((shoe) => (
                <div key={shoe.code} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-ratio-box h-48 flex items-center justify-center bg-gray-50">
                    {shoe.image && (
                      <img
                        src={`data:image/png;base64,${shoe.image}`}
                        alt={shoe.name}
                        className="max-h-full max-w-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-shoe.png';
                          target.alt = 'התמונה לא זמינה';
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {shoe.name || 'נעל ללא שם'}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium ml-1">מקט:</span>
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {shoe.code}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="font-medium ml-1">מיקום:</span>
                        <span>{shoe.loc || 'לא מוגדר'}</span>
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => markAsMissing(shoe)}
                        className="flex-1 mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        חסר
                      </button>
                      <button
                        onClick={() => markAsExists(shoe)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        קיים
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Missing Shoes List */}
      {!loading && showMissingList && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              נעליים חסרות - {getHebrewType(selectedType as ShoeType)}
            </h2>
            <button
              onClick={backToShoeList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              חזרה לרשימת הנעליים
            </button>
          </div>

          {missingShoes.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800">אין נעליים חסרות!</h3>
              <p className="text-green-700 mt-2">כל הנעליים נמצאות במלאי</p>
              <button
                onClick={goBackToTypeSelection}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                חזרה לבחירת קטגוריה
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                סך הכל נעליים חסרות: {missingShoes.length}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {missingShoes.map((shoe) => (
                  <div key={shoe.code} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-red-200">
                    <div className="aspect-ratio-box h-48 flex items-center justify-center bg-gray-50">
                      {shoe.image && (
                        <img
                          src={`data:image/png;base64,${shoe.image}`}
                          alt={shoe.name}
                          className="max-h-full max-w-full object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-shoe.png';
                            target.alt = 'התמונה לא זמינה';
                          }}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {shoe.name || 'נעל ללא שם'}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="font-medium ml-1">מקט:</span>
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {shoe.code}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="font-medium ml-1">מיקום:</span>
                          <span>{shoe.loc || 'לא מוגדר'}</span>
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => removeFromMissingList(shoe)}
                          className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                          הסר מהרשימה
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CloseShoes;