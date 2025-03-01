import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from '../API/authAPI';

const Register = () => {
  const [workerCode, setWorkerCode] = useState('');
  //const [password, setPassword] = useState('');
  //const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateWorkerCode = (code: string) => {
    return code.startsWith('52500') && code.length > 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate worker code format
    if (!validateWorkerCode(workerCode)) {
      setError('קוד עובד חייב להתחיל ב-52500');
      return;
    }

    // Validate password match
    //if (password !== confirmPassword) {
    //  setError('הסיסמאות אינן תואמות');
    //  return;
    //}

    setLoading(true);

    try {
      const response = await AuthAPI.register(workerCode, "52500219");
      
      if (response.success) {
        // Registration successful, redirect to login
        navigate('/login', { state: { registered: true } });
      } else {
        setError(response.message || 'אירעה שגיאה בהרשמה');
      }
    } catch (err) {
      setError(err.message || 'אירעה שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            הרשמה למערכת המחסן של נייקי פ"ת
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            צור חשבון חדש עם פרטי העובד שלך
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="worker-code" className="sr-only">
                קוד עובד
              </label>
              <input
                id="worker-code"
                name="worker-code"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="קוד עובד (חייב להתחיל ב-52500)"
                value={workerCode}
                onChange={(e) => setWorkerCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'מבצע רישום...' : 'הירשם'}
            </button>
          </div>
          
          <div className="text-center">
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              אם זו לא הפעם הראשונה שאתה מבקר באתר - לחץ כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;