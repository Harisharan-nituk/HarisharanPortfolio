// frontend/src/components/routing/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { currentUser, isAdmin, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    // Show a loading indicator while auth state is being determined
    return <div className="flex justify-center items-center h-screen"><div>Loading authentication...</div></div>;
  }

  if (!currentUser) {
    // User not logged in, redirect to login page
    // Pass the current location so we can redirect back after login (optional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdminRoute && !isAdmin) {
    // User is logged in but is not an admin, and this route requires admin
    // Redirect to homepage or an "unauthorized" page
    // For now, let's redirect to homepage. You can create a specific "Unauthorized" page later.
    console.warn("ProtectedRoute: User is not an admin. Redirecting to homepage.");
    return <Navigate to="/" replace />;
  }

  // If all checks pass (user logged in, and is admin if required), render the child route/component
  return <Outlet />; // Outlet renders the nested child route components
};

export default ProtectedRoute;