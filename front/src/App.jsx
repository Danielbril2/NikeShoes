// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ShoeList from './components/ShoeList';
import AddShoe from './components/AddShoe';
import EditShoe from './components/EditShoe';
import Login from './components/Login';
import Register from './components/Register';
import CloseShoes from './components/CloseShoe';
import './App.css';

// Main application component
function AppContent() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="container">
                    <ShoeList />
                  </div>
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="container">
                    <AddShoe />
                  </div>
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:code"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="container">
                    <EditShoe />
                  </div>
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/close"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="container">
                    <CloseShoes />
                  </div>
                </>
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

// Wrapper component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;