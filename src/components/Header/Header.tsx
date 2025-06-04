import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.headerContainer}> {/* Contenedor nuevo */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="logo.png" alt="Logo" />
         
        </div>
      </header>
    </div>
  );
};

export default Header;