import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Role not authorized - redirect to role's home
    const homePath = userInfo.role === 'admin' ? '/' : '/customer-dashboard';
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
