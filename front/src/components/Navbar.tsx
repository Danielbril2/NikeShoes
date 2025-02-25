// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../API/AuthContext';
import '../style/Navbar.css';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar" dir="rtl">
      <div
        className="navbar-brand"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        המחסן של נייקי פ"ת
      </div>
      <div className="navbar-links">
        <Link to="/">כל הנעליים</Link>
        <Link to="/add">הוספת נעל חדשה</Link>
        <Link to="/close">התחל סגירת נעליים</Link>
        <button
          onClick={logout}
          className="logout-button"
        >
          התנתק
        </button>
      </div>
    </nav>
  );
};

export default Navbar;