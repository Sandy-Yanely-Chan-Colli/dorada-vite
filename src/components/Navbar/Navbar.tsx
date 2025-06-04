import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../services/authService';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navContainerInner}>
          <ul className={styles.navLinks}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/reporte-user-list">Reportes</Link></li>
            <li><Link to="/reporte-albercas">Notificaciones</Link></li>
            <li><Link to="/reporte-spa">Contacto</Link></li>
          </ul>

          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              <img src="dogy.png" alt="Perfil de usuario" />
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
