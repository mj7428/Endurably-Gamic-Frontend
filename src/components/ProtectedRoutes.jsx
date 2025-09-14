import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protects routes that require any logged-in user
export const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// Protects routes that require an admin user
export const AdminRoute = () => {
  const { user } = useAuth();
  const isAdmin = user && user.roles.includes('ROLE_ADMIN');
  return isAdmin ? <Outlet /> : <Navigate to="/" />; // Or a custom "unauthorized" page
};