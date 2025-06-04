import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthData } from '../services/authService';

const PrivateRoute = () => {
  const authData = getAuthData();
  const location = useLocation();

  // Si está autenticado y trata de acceder al login, redirige al dashboard
  if (location.pathname === '/login' && authData) {
    return <Navigate to="/dashboard" replace />;
  }

  return authData ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;