import styles from './ReportConfirmation.module.css';

type ReportConfirmationProps = {
  reportData: {
    serviceType?: string;
    fullName?: string;
    rkey?: string;
    email?: string;
    phone?: string;
    title?: string;
    description?: string;
    area?: string;
    date?: string;
    imageUrl?: string;
  };
  onRestart: () => void;
};

export default function ReportConfirmation({ reportData, onRestart }: ReportConfirmationProps) {
  return (
    <div className={styles.step}>
      <h2>Reporte Enviado</h2>
      <div className={styles.checkmarkContainer}>
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
          <circle className={styles.circle} cx="60" cy="60" r="55" stroke="#00C853" strokeWidth="5" fill="none" />
          <path className={styles.checkmark} d="M35,60 L50,75 L85,40" stroke="#00C853" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p>Tu reporte ha sido enviado con éxito 🎉</p>
      
      <div className={styles.reportDetails}>
        <h3>Resumen del Reporte</h3>
        <p><strong>Tipo de Servicio:</strong> {reportData.serviceType || 'No especificado'}</p>
        <p><strong>Título:</strong> {reportData.title || 'No especificado'}</p>
        <p><strong>Área:</strong> {reportData.area || 'No especificado'}</p>
        <p><strong>Fecha:</strong> {reportData.date || 'No especificado'}</p>
        <p><strong>Descripción:</strong> {reportData.description || 'No especificado'}</p>
        
        {reportData.imageUrl && (
          <div className={styles.reportImage}>
            <h4>Imagen adjunta:</h4>
            <img src={reportData.imageUrl} alt="Reporte" />
          </div>
        )}
        
        <h3>Datos del Reportante</h3>
        <p><strong>Nombre:</strong> {reportData.fullName || 'No especificado'}</p>
        <p><strong>RKEY:</strong> {reportData.rkey || 'No especificado'}</p>
        <p><strong>Email:</strong> {reportData.email || 'No especificado'}</p>
        <p><strong>Teléfono:</strong> {reportData.phone || 'No especificado'}</p>
      </div>
      
      <button className={styles.restartButton} onClick={onRestart}>
        Generar otro reporte
      </button>
    </div>
  );
}