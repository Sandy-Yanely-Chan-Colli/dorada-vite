import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, type RegistroCompletoRequest, getAuthData } from '../../services/authService';
import styles from './RegisterUser.module.css';
import NavDashboard from '../NavDashboard/NavDashboard';

const RegisterUser = () => {
  const navigate = useNavigate();
  const authData = getAuthData();

  // Validar que solo admin acceda
  useEffect(() => {
    if (!authData || !authData.Usuario.EsAdmin) {
      navigate('/', { replace: true });
    }
  }, [authData, navigate]);

  const [form, setForm] = useState<RegistroCompletoRequest>({
    FullName: '',
    Rkey: '',
    Phone: '',
    Email: '',
    NombreUsuario: '',
    Contraseña: '',
    EsAdmin: false,
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await registrarUsuario(form);
      setSuccessMsg(`Usuario registrado: ${response.Usuario.FullName}`);
      setForm({
        FullName: '',
        Rkey: '',
        Phone: '',
        Email: '',
        NombreUsuario: '',
        Contraseña: '',
        EsAdmin: false,
      });
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavDashboard />
      <div className={styles.registerContainer}>
        <h2>Registro de Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <input type="text" name="FullName" placeholder="Nombre completo" value={form.FullName} onChange={handleChange} required className={styles.registerInput} />
          <input type="text" name="Rkey" placeholder="Rkey" value={form.Rkey} onChange={handleChange} required className={styles.registerInput} />
          <input type="tel" name="Phone" placeholder="Teléfono" value={form.Phone} onChange={handleChange} required className={styles.registerInput} />
          <input type="email" name="Email" placeholder="Correo electrónico" value={form.Email} onChange={handleChange} required className={styles.registerInput} />
          <input type="text" name="NombreUsuario" placeholder="Nombre de usuario" value={form.NombreUsuario} onChange={handleChange} required className={styles.registerInput} />
          <input type="password" name="Contraseña" placeholder="Contraseña" value={form.Contraseña} onChange={handleChange} required className={styles.registerInput} />
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="EsAdmin" checked={form.EsAdmin} onChange={handleChange} />
            ¿Es administrador?
          </label>
          <button type="submit" className={styles.registerButton} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Usuario'}
          </button>
        </form>

        {successMsg && <p className={styles.successMessage}>{successMsg}</p>}
        {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
      </div>
    </>
  );
};

export default RegisterUser;
