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
import CloseShoes from './components/CloseShoe';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />

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
    </Router>
  );
}

export default App;