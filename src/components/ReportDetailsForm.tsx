import { useState } from 'react';
import { getAuthData, getAuthHeaders } from '../services/authService';
import styles from './ReportDetailsForm.module.css';

interface Props {
  serviceType: string;
  initialData: {
    title?: string;
    description?: string;
    area?: string;
    date?: string;
    imageUrl?: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    area: string;
    date: string;
    imageUrl: string;
  }) => void;
  onBack: () => void;
  onSuccess: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7200/api';

export default function ReportDetailsForm({
  serviceType,
  initialData,
  onSubmit,
  onBack,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [area, setArea] = useState(initialData.area || '');
  const [date, setDate] = useState(initialData.date || '');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const [mensaje, setMensaje] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const authData = getAuthData();
    if (!authData) {
      setMensaje('Usuario no autenticado.');
      return;
    }

    const nuevoReporte = {
      Titulo: title,
      Descripcion: description,
      Area: area,
      WaitingTime: date,
      Schedule: serviceType,
      ImagenUrl: imageUrl,
      UsuarioId: authData.Usuario.Id,
    };

    try {
      const response = await fetch(`${API_URL}/Reportes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(nuevoReporte),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el reporte');
      }

      setMensaje('✅ Reporte enviado correctamente.');
      onSubmit({ title, description, area, date, imageUrl });
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMensaje(`❌ ${error.message}`);
      } else {
        setMensaje('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSend}>
      <h2>Detalles del Reporte</h2>

      <div className={styles.formField}>
        <label>Título:</label>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={styles.formField}>
        <label>Descripción:</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className={styles.formField}>
        <label>Área:</label>
        <input
          className={styles.input}
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />
      </div>

      <div className={styles.formField}>
        <label>Fecha:</label>
        <input
          className={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className={styles.formField}>
        <label>URL de Imagen:</label>
        <input
          className={styles.input}
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className={styles.submitButton}>
          Enviar
        </button>
      </div>

      {mensaje && (
        <p
          className={`${styles.message} ${
            mensaje.includes('Error') || mensaje.includes('❌') ? styles.error : styles.success
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}
