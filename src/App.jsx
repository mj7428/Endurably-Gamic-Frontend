import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import TournamentRegistrationsPage from './components/TournamentRegistrationsPage';
import { API_BASE_URL } from './config'; 
import baseLayoutService from './services/baseLayoutService';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, login, logout } = useAuth(); 
  const [activeTournamentId, setActiveTournamentId] = useState(null);

  const [layouts, setLayouts] = useState([]);
  const [activeTownHall, setActiveTownHall] = useState(15);
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef();
  const lastBaseElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // ✅ HOOK 1: Handles fetching a NEW set of layouts.
  // This runs when the town hall filter changes or when navigating back to the home page.
  useEffect(() => {
    // Only run this logic when on the home page.
    if (currentPage !== 'home') return;

    // Reset state for the new search
    setLayouts([]);
    setPage(0);
    setHasMore(true);
    
    const fetchInitialLayouts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Always fetch the first page (page: 0) for a new search
        const response = await baseLayoutService.getAll({ page: 0, size: 8 }, activeTownHall);
        setLayouts(response.data.content);
        setHasMore(!response.data.last);
      } catch (err) {
        setError('Failed to fetch base layouts. Is the server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialLayouts();
  }, [activeTownHall, currentPage]); // Dependencies: the filter and the page itself


  // ✅ HOOK 2: Handles fetching SUBSEQUENT pages for infinite scroll.
  // This runs only when the page number increases.
  useEffect(() => {
    // Don't run this for the initial load (page 0) or if not on the home page.
    if (page === 0 || currentPage !== 'home' || !hasMore) return;

    const fetchMoreLayouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await baseLayoutService.getAll({ page, size: 8 }, activeTownHall);
        // Append the new layouts to the existing list
        setLayouts(prevLayouts => [...prevLayouts, ...response.data.content]);
        setHasMore(!response.data.last);
      } catch (err) {
        setError('Failed to fetch base layouts. Is the server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoreLayouts();
  }, [page]); // Dependency: only the page number


  const handleLoginSuccess = () => { login(); setCurrentPage('home'); };
  const handleLogout = () => { logout(); setCurrentPage('home'); };
  const navigateTo = (page) => { setActiveTournamentId(null); setCurrentPage(page); };
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
              <BaseLayoutGrid 
                layouts={layouts} 
                loading={loading} 
                error={error} 
                apiBaseUrl={API_BASE_URL}
                lastBaseElementRef={lastBaseElementRef}
              />
            </main>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <Navbar 
        onLogout={handleLogout}
        onNavigate={navigateTo} 
      />
      {renderPage()}
    </div>
  );
}

export default App;
