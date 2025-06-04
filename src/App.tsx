import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Home from './pages/Home/Home';
import ReporteAlbercas from './pages/ReporteAlbercas';
import ReporteSpa from './pages/ReporteSpa';
import PrivateRoute from './pages/PrivateRoute';
import { getAuthData } from './services/authService';
import ReporteCalles from './pages/ReporteCalles';
import Reportegym from './pages/Reportegym';
import ReporteEntrada from './pages/ReporteEntrada';
import ReporteCanchas from './pages/ReporteCanchas';

function App() {
  const authData = getAuthData();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={authData ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/reporte-albercas" element={<ReporteAlbercas />} />
          <Route path="/reporte-spa" element={<ReporteSpa />} />
          <Route path="/reporte-calles" element={<ReporteCalles />} />
          <Route path="/reporte-gym" element={<Reportegym />} />
          <Route path="/reporte-entrada" element={<ReporteEntrada />} />
          <Route path="/reporte-canchas" element={<ReporteCanchas />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;