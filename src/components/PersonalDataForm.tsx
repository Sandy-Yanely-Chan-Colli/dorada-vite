import { useEffect, useState } from 'react';
import styles from './PersonalDataForm.module.css';
import { getAuthData, type UserData } from '../services/authService';

interface PersonalDataFormProps {
  onNext?: (data: {
    fullName: string;
    rkey: string;
    email?: string;
    phone?: string;
  }) => void;
  onBack?: () => void;
  initialData?: {
    fullName?: string;
    rkey?: string;
    email?: string;
    phone?: string;
  };
}

export default function PersonalDataForm({ onNext, onBack, initialData }: PersonalDataFormProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuthData();

      if (!auth || !auth.token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://localhost:7200/api/Usuarios/${auth.Usuario.Id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudieron obtener los datos del usuario');
        }

        const data = await response.json();
        // Combinamos los datos de la API con los initialData si existen
        setUserData({
          ...data,
          FullName: initialData?.fullName || data.FullName,
          Rkey: initialData?.rkey || data.Rkey,
          Email: initialData?.email || data.Email,
          Phone: initialData?.phone || data.Phone
        });
      } catch (err: any) {
        console.error('Error al obtener los datos:', err);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialData]);

  const handleNext = () => {
    if (userData && onNext) {
      onNext({
        fullName: userData.FullName,
        rkey: userData.Rkey,
        email: userData.Email,
        phone: userData.Phone
      });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando tus datos...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <a href="/login" className={styles.loginLink}>Ir a la página de login</a>
      </div>
    );
  }

  if (!userData) {
    return <div className={styles.error}>No se encontraron datos del usuario</div>;
  }

  return (
    <div className={styles.step}>
      <h2>Mis Datos Personales</h2>
      <div className={styles.formContainer}>
        <div className={styles.formList}>
          <div className={styles.formField}>
            <label>Nombre completo</label>
            <div className={styles.userData}>{userData.FullName}</div>
          </div>
          <div className={styles.formField}>
            <label>Rkey</label>
            <div className={styles.userData}>{userData.Rkey}</div>
          </div>
          <div className={styles.formField}>
            <label>Teléfono</label>
            <div className={styles.userData}>{userData.Phone || 'No especificado'}</div>
          </div>
          <div className={styles.formField}>
            <label>Email</label>
            <div className={styles.userData}>{userData.Email || 'No especificado'}</div>
          </div>
          
        </div>

        {(onBack || onNext) && (
          <div className={styles.formActions}>
            {onBack && (
              <button onClick={onBack} className={styles.backButton}>
                Atrás
              </button>
            )}
            {onNext && (
              <button 
                onClick={handleNext} 
                className={styles.nextButton}
                disabled={!userData?.FullName || !userData?.Rkey}
              >
                Siguiente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}