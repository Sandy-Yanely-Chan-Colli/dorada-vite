import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthData } from '../services/authService';

const PrivateAdminRoute = () => {
  const authData = getAuthData();
  const location = useLocation();

  if (!authData) {
    // Usuario no autenticado → redirigir al login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!authData.Usuario.EsAdmin) {
    // Usuario autenticado pero no es admin → redirigir a Home
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y es admin → permitir acceso
  return <Outlet />;
};

export default PrivateAdminRoute;
