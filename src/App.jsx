import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout and Route Protection
import Layout from './components/Layout';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoutes';

// Import Page Components
import HomePage from './Home';
import Login from './components/Login';
import Register from './components/Register';
import SubmitBase from './components/SubmitBase';
import TournamentsPage from './components/TournamentsPage';
import CreateTournamentPage from './components/CreateTournamentPage';
import TournamentDetailPage from './components/TournamentDetailPage';
import TournamentRegistrationsPage from './components/TournamentRegistrationsPage';
import TournamentBracketPage from './components/TournamentBracketPage';
import { PrivacyPolicyPage, TermsOfServicePage } from './components/LegalPages';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import MartHomePage from './mart/components/MartHomePage';
import MartLayout from './mart/components/MartLayout';
import CartPage from './mart/pages/CartPage';
import CheckoutSuccessPage from './mart/pages/CheckoutSuccessPage';
import OrderHistoryPage from './mart/pages/OrderHistoryPage';
import CheckoutPage from './mart/pages/CheckoutPage';
import AdminDashboardPage from './mart/pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mart/*" element={<MartLayout />}>
            <Route index element={<MartHomePage />} />
            {/* You can add other mart-specific routes here in the future */}
            <Route element={<PrivateRoute />}>
              <Route path="cart" element={<CartPage />} />
              <Route path="order-success" element={<CheckoutSuccessPage />} />
              <Route path="my-orders" element={<OrderHistoryPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
        </Route>

        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="terms" element={<TermsOfServicePage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="tournaments" element={<TournamentsPage />} />
          <Route path="tournaments/:tournamentId" element={<TournamentDetailPage />} />
          <Route path="tournaments/:tournamentId/bracket" element={<TournamentBracketPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* User Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="submit" element={<SubmitBase />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="tournaments/create" element={<CreateTournamentPage />} />
            <Route path="tournaments/:tournamentId/registrations" element={<TournamentRegistrationsPage />} />
            <Route path="admin-review" element={<AdminDashboardPage />} /> 
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

