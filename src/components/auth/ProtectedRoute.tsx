import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';

export function ProtectedRoute() {
  const [isAuthenticated] = useState(true); // Временно всегда true для разработки

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}