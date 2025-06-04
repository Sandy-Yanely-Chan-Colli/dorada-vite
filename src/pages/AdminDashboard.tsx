import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/authService';
import styles from './AdminDashboard.module.css';
import NavDashboard from '../components/NavDashboard/NavDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const authData = getAuthData();

  useEffect(() => {
    if (!authData || !authData.Usuario.EsAdmin) {
      navigate('/', { replace: true });
    }
  }, [authData, navigate]);

  return (
    <div className={styles.dashboardContainer}>
      <NavDashboard />
      <main className={styles.content}>
        <h1>Hola Administrador, tu sesión fue correcta</h1>
        <p>Este es tu panel de administración.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
