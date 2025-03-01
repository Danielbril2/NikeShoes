import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoeAPI, Shoe, ShoeType } from '../API/RestAPI';

const AddShoe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    loc: '',
    type: 'Man' as ShoeType, // Default value
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setError('יש לבחור תמונה');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const imageArrayBuffer = await formData.image.arrayBuffer();
      const newShoe: Shoe & { type: ShoeType } = {
        code: formData.code,
        name: formData.name,
        loc: parseInt(formData.loc),
        type: formData.type,
        image: imageArrayBuffer
      };

      await ShoeAPI.addShoe(newShoe);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'נכשל בהוספת הנעל');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">הוספת נעל חדשה</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            מקט
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.loc}
            onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            סוג
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ShoeType })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 appearance-none pl-10"
              required
            >
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תמונה
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
          />
          {formData.image && (
            <div className="mt-2 h-48 flex items-center justify-center bg-gray-50 rounded">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="תצוגה מקדימה"
                className="max-h-full max-w-full object-contain p-2"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-reverse space-x-0 space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -mr-1 ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                מוסיף...
              </span>
            ) : (
              'הוסף נעל'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShoe;