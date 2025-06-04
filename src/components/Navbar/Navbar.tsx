import { useNavigate } from 'react-router-dom';
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
            <li><a href="/">Reportes</a></li>
            <li><a href="/reporte-albercas">Notifiaciones</a></li>
            <li><a href="/reporte-spa">Contacto</a></li>
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