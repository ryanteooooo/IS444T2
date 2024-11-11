import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC = () => {
  const { accountID } = useAuth();
  const location = useLocation();

  if (!accountID) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the child components if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
