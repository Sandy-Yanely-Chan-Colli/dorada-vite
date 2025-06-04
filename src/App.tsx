import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Home from './pages/Home/Home';
import ReporteAlbercas from './pages/ReporteAlbercas';
import ReporteSpa from './pages/ReporteSpa';
import ReporteCalles from './pages/ReporteCalles';
import Reportegym from './pages/Reportegym';
import ReporteEntrada from './pages/ReporteEntrada';
import ReporteCanchas from './pages/ReporteCanchas';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './pages/PrivateRoute';
import PrivateAdminRoute from './pages/PrivateAdminRoute';
import { getAuthData } from './services/authService';
import RegisterUser from './components/RegisterUser/RegisterUser';
import ListaUsuarios from './components/ListaUsuarios/ListaUsuarios';
import ListaReportes from './components/ListaReportes/ListaReportes';

function App() {
  const authData = getAuthData();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route 
          path="/login" 
          element={authData ? (
            authData.Usuario.EsAdmin 
              ? <Navigate to="/admin/dashboard" replace /> 
              : <Navigate to="/" replace />
          ) : (
            <Login />
          )} 
        />

        {/* Rutas protegidas para cualquier usuario autenticado */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/reporte-albercas" element={<ReporteAlbercas />} />
          <Route path="/reporte-spa" element={<ReporteSpa />} />
          <Route path="/reporte-calles" element={<ReporteCalles />} />
          <Route path="/reporte-gym" element={<Reportegym />} />
          <Route path="/reporte-entrada" element={<ReporteEntrada />} />
          <Route path="/reporte-canchas" element={<ReporteCanchas />} />
        </Route>

        {/* Rutas protegidas solo para administradores */}
        <Route element={<PrivateAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard-register" element={<RegisterUser />} />
            <Route path="/admin/dashboard-lista-usuarios" element={<ListaUsuarios/>} />
            <Route path="/admin/dashboard-lista-reportes" element={<ListaReportes/>} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
