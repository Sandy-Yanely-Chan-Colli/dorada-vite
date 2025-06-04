import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import styles from './NavDashboard.module.css';
import { useState } from 'react';

const NavDashboard = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleMenu = (): void => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <a href="/admin/dashboard" className={styles.brandLink}>
            Dashboard
          </a>
        </div>

        <div className={styles.navMain}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/admin/dashboard" className={styles.navLink}>
                Home
              </a>
            </li>

            <li className={styles.navItem}>
              <a href="/admin/dashboard-lista-reportes" className={styles.navLink}>
                Reportes
              </a>
            </li>

            <li className={`${styles.navItem} ${styles.dropdown}`}>
              <button
                className={styles.dropdownToggle}
                onClick={toggleMenu}
                aria-expanded={showMenu}
                aria-haspopup="true"
              >
                <span className={styles.arrow}>▾</span> Usuarios
              </button>
              {showMenu && (
                <div className={styles.dropdownMenu}>
                  <a
                    href="/admin/dashboard-register"
                    className={styles.dropdownItem}
                    onClick={() => setShowMenu(false)}
                  >
                    Registrar Usuario
                  </a>
                  <a
                    href="/admin/dashboard-lista-usuarios"
                    className={styles.dropdownItem}
                    onClick={() => setShowMenu(false)}
                  >
                    Lista de Usuarios
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>

        <div className={styles.navEnd}>
          <div className={styles.userProfile}>
            <img
              src="/dogy.png"
              alt="User profile"
              className={styles.userAvatar}
              width={32}
              height={32}
            />
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavDashboard;
