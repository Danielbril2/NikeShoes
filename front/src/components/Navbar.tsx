// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../API/AuthContext';
import '../style/Navbar.css';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
      
      {/* Mobile menu button */}
      <button className="mobile-menu-button" onClick={toggleMenu}>
        ☰
      </button>
      
      {/* Navigation links */}
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        {/* Close button for mobile menu */}
        <button className="close-menu" onClick={closeMenu}>
          ✕
        </button>
        
        <Link to="/" onClick={closeMenu}>כל הנעליים</Link>
        <Link to="/add" onClick={closeMenu}>הוספת נעל חדשה</Link>
        <Link to="/close" onClick={closeMenu}>התחל סגירת נעליים</Link>
        <button
          onClick={() => {
            closeMenu();
            logout();
          }}
          className="logout-button"
        >
          התנתק
        </button>
      </div>
    </nav>
  );
};

export default Navbar;