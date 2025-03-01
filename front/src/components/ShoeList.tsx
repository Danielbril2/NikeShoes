import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoeAPI, Shoe, ShoeType } from '../API/RestAPI';
import { Search } from 'lucide-react';
import { AuthAPI } from '../API/authAPI';

const ShoeList = () => {
  const [allShoes, setAllShoes] = useState<Shoe[]>([]); // Store all shoes from API
  const [displayedShoes, setDisplayedShoes] = useState<Shoe[]>([]); // Store filtered/displayed shoes
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState<ShoeType | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all shoes on initial load
  useEffect(() => {
    const loadShoes = async () => {
      try {
        if (!AuthAPI.getToken()) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError(null);
        
        const fetchedShoes = await ShoeAPI.getAllShoes();
        setAllShoes(fetchedShoes); // Store all shoes
        setDisplayedShoes(fetchedShoes); // Initially display all shoes
      } catch (err) {
        console.error('Load error:', err);
        setError('נכשל בטעינת נעליים');
      } finally {
        setLoading(false);
      }
    };

    loadShoes();
  }, [navigate]);

  // Filter shoes by code
  const handleSearchByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode) {
      const filtered = allShoes.filter(shoe => 
        shoe.code && shoe.code.startsWith(searchCode)
      );
      
      setDisplayedShoes(filtered);
      
      if (filtered.length === 0) {
        setError('לא נמצאו נעליים עם המקט המבוקש');
      } else {
        setError(null);
      }
    }
  };

  // Filter shoes by name
  const handleSearchByName = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName) {
      const filtered = allShoes.filter(shoe =>
        shoe.name && shoe.name.toLowerCase().includes(searchName.toLowerCase())
      );
      
      setDisplayedShoes(filtered);
      
      if (filtered.length === 0) {
        setError('לא נמצאו נעליים עם השם המבוקש');
      } else {
        setError(null);
      }
    }
  };

  // Filter shoes by location
  const handleSearchByLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation) {
      const locationNumber = parseInt(searchLocation, 10);
      if (isNaN(locationNumber)) {
        setError('מספר מיקום לא תקין');
        return;
      }
      
      const filtered = allShoes.filter(shoe => 
        shoe.loc === locationNumber
      );
      
      setDisplayedShoes(filtered);
      
      if (filtered.length === 0) {
        setError('לא נמצאו נעליים במיקום המבוקש');
      } else {
        setError(null);
      }
    }
  };

  // Filter shoes by type
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as ShoeType | '';
    setSelectedType(type);

    if (type) {
      const filtered = allShoes.filter(shoe => shoe.type === type);
      setDisplayedShoes(filtered);
      
      if (filtered.length === 0) {
        setError(`לא נמצאו נעלי ${getHebrewType(type as ShoeType)}`);
      } else {
        setError(null);
      }
    } else {
      // If no type is selected, show all shoes
      setDisplayedShoes(allShoes);
      setError(null);
    }
  };

  // Reset all filters and show all shoes
  const handleResetSearch = () => {
    setSearchCode('');
    setSearchName('');
    setSearchLocation('');
    setSelectedType('');
    setDisplayedShoes(allShoes);
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

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">מלאי נעליים</h1>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">חיפוש וסינון</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סינון לפי סוג</label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                disabled={loading}
              >
                <option value="">כל הסוגים</option>
                <option value="Man">גברים</option>
                <option value="Woman">נשים</option>
                <option value="Children">ילדים</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Code Search */}
          <div>
            <form onSubmit={handleSearchByCode}>
              <label className="block text-sm font-medium text-gray-700 mb-2">חיפוש לפי מקט</label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed text-sm font-medium"
                  disabled={loading || !searchCode}
                >
                  חיפוש
                </button>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="הכנס מקט נעל..."
                    className="w-full pr-9 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Name Search */}
          <div>
            <form onSubmit={handleSearchByName}>
              <label className="block text-sm font-medium text-gray-700 mb-2">חיפוש לפי שם</label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed text-sm font-medium"
                  disabled={loading || !searchName}
                >
                  חיפוש
                </button>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="הכנס שם נעל..."
                    className="w-full pr-9 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Location Search */}
          <div>
            <form onSubmit={handleSearchByLocation}>
              <label className="block text-sm font-medium text-gray-700 mb-2">חיפוש לפי מיקום</label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed text-sm font-medium"
                  disabled={loading || !searchLocation}
                >
                  חיפוש
                </button>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="הכנס מספר מיקום..."
                    className="w-full pr-9 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    disabled={loading}
                    min="0"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Active Filters & Reset Button */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 mb-3 md:mb-0">
            {selectedType && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                סוג: {getHebrewType(selectedType as ShoeType)}
                <button onClick={() => { setSelectedType(''); setDisplayedShoes(allShoes); }} className="mr-2 text-blue-500 hover:text-blue-700">
                  ×
                </button>
              </div>
            )}
            {searchCode && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                מקט: {searchCode}
                <button onClick={() => { setSearchCode(''); setDisplayedShoes(allShoes); }} className="mr-2 text-blue-500 hover:text-blue-700">
                  ×
                </button>
              </div>
            )}
            {searchName && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                שם: {searchName}
                <button onClick={() => { setSearchName(''); setDisplayedShoes(allShoes); }} className="mr-2 text-blue-500 hover:text-blue-700">
                  ×
                </button>
              </div>
            )}
            {searchLocation && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                מיקום: {searchLocation}
                <button onClick={() => { setSearchLocation(''); setDisplayedShoes(allShoes); }} className="mr-2 text-blue-500 hover:text-blue-700">
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
            disabled={loading}
          >
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            איפוס הכל
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          תוצאות {displayedShoes.length > 0 && `(${displayedShoes.length})`}
        </h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>

      {/* Show custom loading with message */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-3">אם יונתן היה מוכן לשלם על שרת זה היה מהיר יותר</p>
          <div className="relative h-4 w-64 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      )}

      {/* Error message */}
      {!loading && error && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-red-500 font-medium">{error}</div>
        </div>
      )}

      {/* No results message */}
      {!loading && !error && displayedShoes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-2">🔍</div>
          <div className="text-gray-500">לא נמצאו נעליים התואמות את החיפוש</div>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && displayedShoes.length > 0 && (
        <div className="shoe-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedShoes.map((shoe) => (
            <div key={shoe.code} className="shoe-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
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
              <div className="shoe-info p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{shoe.name || 'נעל ללא שם'}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="font-medium ml-1">מקט:</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{shoe.code}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="font-medium ml-1">מיקום:</span>
                    <span>{shoe.loc || 'לא מוגדר'}</span>
                  </p>
                </div>
                <div className="mt-4 flex justify-start">
                  <Link
                    to={`/edit/${shoe.code}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    עריכה
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoeList;