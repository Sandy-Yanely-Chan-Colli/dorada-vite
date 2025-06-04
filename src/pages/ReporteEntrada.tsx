import { useState } from 'react';
import styles from './ReporteAlbercas.module.css';
import ServiceSelection from '../components/ServiceSelection';
import type { Service } from '../components/ServiceSelection'; // Import type-only
import PersonalDataForm from '../components/PersonalDataForm';
import ReportDetailsForm from '../components/ReportDetailsForm';
import ReportConfirmation from '../components/ReportConfirmation';

// Importación de iconos
import accesoIcon from '../assets/icons/acceso.svg';
import iluminacionIcon from '../assets/icons/iluminacion.svg';
import portonIcon from '../assets/icons/porton.svg';
import obstrucciondeaccesoIcon from '../assets/icons/obstrucciondeacceso.svg';

// Tipo local para datos del reporte
interface ReportDataType {
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
}

// Servicios disponibles
const ENTRY_SERVICES: Service[] = [
  { id: 'acceso', label: 'Acceso', icon: accesoIcon },
  { id: 'iluminacion', label: 'Iluminación', icon: iluminacionIcon },
  { id: 'porton', label: 'Portón', icon: portonIcon },
  { id: 'obstrucciondeacceso', label: 'Obstrucción de Acceso', icon: obstrucciondeaccesoIcon },
];

export default function ReporteEntrada() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<ReportDataType>({});

  const handleServiceSelect = (serviceType: string) => {
    setReportData(prev => ({ ...prev, serviceType }));
  };

  const handlePersonalDataSubmit = (data: {
    fullName: string;
    rkey: string;
    email?: string;
    phone?: string;
  }) => {
    setReportData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleReportDetailsSubmit = (data: Pick<ReportDataType, 'title' | 'description' | 'area' | 'date' | 'imageUrl'>) => {
    setReportData(prev => ({ ...prev, ...data }));
  };

  const restartForm = () => {
    setReportData({});
    setCurrentStep(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step}
            className={`${styles.progressCircle} ${currentStep >= step ? styles.active : ''}`}
            aria-current={currentStep === step ? 'step' : undefined}
          />
        ))}
      </div>

      <div className={styles.content}>
        {currentStep === 1 && (
          <ServiceSelection 
            services={ENTRY_SERVICES}
            title="Servicios brindados en la ENTRADA"
            onSelect={handleServiceSelect}
            onNext={() => reportData.serviceType ? setCurrentStep(2) : alert('Por favor selecciona un servicio')}
            selectedService={reportData.serviceType || null}
            className={styles.serviceSelection}
          />
        )}

        {currentStep === 2 && (
          <PersonalDataForm 
            onNext={handlePersonalDataSubmit}
            onBack={() => setCurrentStep(1)}
            initialData={{
              fullName: reportData.fullName,
              rkey: reportData.rkey,
              email: reportData.email,
              phone: reportData.phone
            }}
          />
        )}

        {currentStep === 3 && (
          <ReportDetailsForm 
            onSubmit={handleReportDetailsSubmit}
            onBack={() => setCurrentStep(2)}
            serviceType={reportData.serviceType || ''}
            initialData={reportData}
            onSuccess={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <ReportConfirmation 
            reportData={reportData}
            onRestart={restartForm}
          />
        )}
      </div>
    </div>
  );
}
