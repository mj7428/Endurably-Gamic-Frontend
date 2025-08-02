import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import Header from './components/Header';
import BaseLayoutGrid from './components/BaseLayoutGrid';
import Login from './components/Login';
import Register from './components/Register';
import SubmitBase from './components/SubmitBase'; // 1. Import the new component
import authService from './services/authService';

// Replace with your EC2 instance's current Public IP address.
const API_BASE_URL = 'http://localhost:8080'; 

function App() {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTownHall, setActiveTownHall] = useState(15);
  const [currentUserToken, setCurrentUserToken] = useState(authService.getCurrentUserToken());
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const fetchLayouts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: 0, size: 10, sort: 'id,desc', townhallLevel: activeTownHall });
        const response = await axios.get(`${API_BASE_URL}/bases?${params.toString()}`);
        setLayouts(response.data.content);
        setError(null);
      } catch (err) {
        setError('Failed to fetch base layouts. Is the server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (currentPage === 'home') {
        fetchLayouts();
    }
  }, [activeTownHall, currentPage]);

  const handleLoginSuccess = () => {
    setCurrentUserToken(authService.getCurrentUserToken());
    setCurrentPage('home');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUserToken(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setCurrentPage} />;
    }
    if (currentPage === 'register') {
      return <Register onNavigate={setCurrentPage} />;
    }
    // 2. Add the case for the submit page
    if (currentPage === 'submit') {
      return <SubmitBase onNavigate={setCurrentPage} />;
    }
    
    // Default to home page
    return (
      <>
        <Header activeTownHall={activeTownHall} setActiveTownHall={setActiveTownHall} />
        <main className="container mx-auto px-4 py-8">
          <BaseLayoutGrid layouts={layouts} loading={loading} error={error} apiBaseUrl={API_BASE_URL} />
        </main>
      </>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <Navbar 
        userToken={currentUserToken} 
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
}

export default App;
