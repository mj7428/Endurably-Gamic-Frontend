import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import Header from './components/Header';
import BaseLayoutGrid from './components/BaseLayoutGrid';
import Login from './components/Login';
import Register from './components/Register';
import SubmitBase from './components/SubmitBase';
import TournamentsPage from './components/TournamentsPage';
import { useAuth } from './context/AuthContext';
import CreateTournamentPage from './components/CreateTournamentPage';
import TournamentDetailPage from './components/TournamentDetailPage';
import TournamentRegistrationsPage from './components/TournamentRegistrationsPage'; // Import the admin view page


const API_BASE_URL = 'http://localhost:8080'; 

function App() {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTownHall, setActiveTownHall] = useState(15);
  const [currentPage, setCurrentPage] = useState('home');
  const { user, login, logout } = useAuth(); 
  const [activeTournamentId, setActiveTournamentId] = useState(null);

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
    login(); 
    setCurrentPage('home');
  };

  const handleLogout = () => {
    logout(); 
    setCurrentPage('home');
  };

  const navigateTo = (page) => {
    setActiveTournamentId(null); 
    setCurrentPage(page);
  };

  const viewTournamentDetails = (id) => {
    setActiveTournamentId(id);
    if (user && user.roles.includes('ROLE_ADMIN')) {
      setCurrentPage('view-registrations');
    } else {
      setCurrentPage('tournament-detail');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigateTo} />;
      case 'register':
        return <Register onNavigate={navigateTo} />;
      case 'submit':
        return <SubmitBase />;
      case 'tournaments':
        return <TournamentsPage onNavigate={navigateTo} onViewDetails={viewTournamentDetails} />;
      case 'create-tournament':
        return <CreateTournamentPage onNavigate={navigateTo}/>;
      case 'tournament-detail':
        return <TournamentDetailPage tournamentId={activeTournamentId} onNavigate={navigateTo} />;
      case 'view-registrations':
        return <TournamentRegistrationsPage tournamentId={activeTournamentId} />;
      default:
        return (
          <>
            <Header activeTownHall={activeTownHall} setActiveTownHall={setActiveTownHall} />
            <main className="container mx-auto px-4 py-8">
              <BaseLayoutGrid layouts={layouts} loading={loading} error={error} apiBaseUrl={API_BASE_URL} />
            </main>
          </>
        );
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <Navbar 
        onLogout={handleLogout}
        onNavigate={navigateTo} // Use navigateTo for general navigation
      />
      {renderPage()}
    </div>
  );
}

export default App;
