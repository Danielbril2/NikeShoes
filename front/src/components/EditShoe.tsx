import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoeAPI, Shoe } from '../API/RestAPI';

const EditShoe = () => {
  const params = useParams();
  const code = params.code;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      if (!code) return;

      try {
        setLoading(true);
        const data = await ShoeAPI.getShoeByCode(code);

        // Check if we got results and use the first match
        if (data && data.length > 0) {
          setShoe(data[0]); // Use the first shoe from the returned array
          setError(null);
        } else {
          setError('הנעל לא נמצאה');
          setShoe(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'נכשל בטעינת הנעל');
        setShoe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShoe();
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoe) return;

    try {
      setLoading(true);
      setError(null);

      await ShoeAPI.updateShoe({
        code: shoe.code,
        name: shoe.name,
        loc: shoe.loc
      });

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'נכשל בעדכון הנעל');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shoe || !code) return;

    try {
      setDeleting(true);
      setError(null);

      await ShoeAPI.deleteShoe(code);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'נכשל במחיקת הנעל');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8" dir="rtl">
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>טוען...</p>
        </div>
      </div>
    );
  }

  if (error || !shoe) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8" dir="rtl">
        <div className="text-center py-8 text-red-500">
          {error || 'הנעל לא נמצאה'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">עריכת נעל</h2>

      <div className="mb-6">
        <img
          src={`data:image/png;base64,${shoe.image}`}
          alt={shoe.name}
          className="w-full h-64 object-contain rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-shoe.png';
            target.alt = 'התמונה לא זמינה';
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            קוד
          </label>
          <input
            type="text"
            disabled
            className="w-full p-2 border rounded bg-gray-50"
            value={shoe.code}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            שם
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={shoe.name || ''}
            onChange={(e) => setShoe({ ...shoe, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            מיקום
          </label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={shoe.loc || ''}
            onChange={(e) => setShoe({ ...shoe, loc: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex space-x-reverse space-x-0 space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading || deleting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'מעדכן...' : 'עדכן נעל'}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading || deleting || showDeleteConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 transition-colors"
          >
            {deleting ? 'מוחק...' : 'מחק'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full" dir="rtl">
            <h3 className="text-xl font-bold mb-4">אישור מחיקה</h3>
            <p className="mb-6">
              האם אתה בטוח שברצונך למחוק נעל זו? פעולה זו אינה ניתנת לביטול.
            </p>
            <div className="flex space-x-reverse space-x-0 space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                {deleting ? 'מוחק...' : 'מחק לצמיתות'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          חזרה לרשימת הנעליים
        </button>
      </div>
    </div>
  );
};

export default EditShoe;