import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME_ROUTES } from '../constants/roles';

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    const fallbackRoute = ROLE_HOME_ROUTES[user?.role] || '/unauthorized';
    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
}