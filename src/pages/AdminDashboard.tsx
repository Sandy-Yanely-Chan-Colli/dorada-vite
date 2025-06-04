import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, logout } from '../services/authService';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const authData = getAuthData();

  // Validación de acceso: solo administradores
  useEffect(() => {
    if (!authData || !authData.Usuario.EsAdmin) {
      navigate('/', { replace: true });
    }
  }, [authData, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <ul className={styles.navLinks}>
            <li><a href="#">Panel</a></li>
            <li><a href="#">Usuarios</a></li>
            <li><a href="#">Configuración</a></li>
          </ul>

          <div className={styles.userSection}>
            <img src="/dogy.png" alt="Admin" className={styles.userIcon} />
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.content}>
        <h1>Hola Administrador, tu sesión fue correcta</h1>
        <p>Este es tu panel de administración.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
