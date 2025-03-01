import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../API/AuthContext';
import { AuthAPI } from '../API/authAPI';

const Login = () => {
  const [workerCode, setWorkerCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check for registration success message
  useEffect(() => {
    if (location.state?.registered) {
      setError('');
      const registrationMessage = document.getElementById('registration-success');
      if (registrationMessage) {
        registrationMessage.classList.remove('hidden');
      }
    }
  }, [location.state]);

  // Attempt auto-login with stored token
  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated) {
        setLoading(true);
        try {
          const isValid = await AuthAPI.verifyToken(token);
          if (isValid) {
            login(token);
            navigate('/');
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            setLoading(false);
          }
        } catch (err) {
          console.error('Auto-login error:', err);
          localStorage.removeItem('token');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    autoLogin();
  }, [login, navigate, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthAPI.login(workerCode, password);
      login(response.token);
      navigate('/');
    } catch (err) {
      setError('קוד עובד או סיסמה לא תקינים');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            המחסן של נייקי פ"ת
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            אנא התחבר עם פרטי העובד שלך
          </p>
        </div>
        
        <div id="registration-success" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative hidden">
          <span className="block sm:inline">הרשמה בוצעה בהצלחה! אנא התחבר למערכת</span>
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
                מספר אישי
              </label>
              <input
                id="worker-code"
                name="worker-code"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="קוד עובד"
                value={workerCode}
                onChange={(e) => setWorkerCode(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                מספר עובד של האחמש האהוב עליך
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="מספר עובד של האחמש האהוב עליך"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </button>
          </div>
          
          <div className="text-center">
            <Link to="/register" className="text-blue-500 hover:text-blue-600">
              במידה וזאת פעם ראשונה שאתם נכנסים לאתר - נא להירשם כאן
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;