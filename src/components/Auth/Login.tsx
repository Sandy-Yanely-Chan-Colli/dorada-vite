import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, getAuthData } from '../../services/authService';
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificación de autenticación mejorada holis 
  useEffect(() => {
    const authData = getAuthData();
    if (authData?.token) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Usuario y contraseña son requeridos');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);
      // Redirección después de login exitoso
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error de autenticación');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginBackground}>
      <h1 className={styles.pageTitle}>RESIDENCIA ISLA DORADA</h1>

      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>INICIO SESIÓN</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="USUARIO"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={styles.loginInput}
          />
          <input
            type="password"
            placeholder="CONTRASEÑA"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={styles.loginInput}
          />
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'CARGANDO...' : 'INICIAR'}
          </button>
        </form>
        {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
