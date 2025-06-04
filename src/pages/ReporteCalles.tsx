import { useState } from 'react';
import styles from './ReporteAlbercas.module.css';
import ServiceSelection from '../components/ServiceSelection';
import type { Service } from '../components/ServiceSelection'; // Import type-only
import PersonalDataForm from '../components/PersonalDataForm';
import ReportDetailsForm from '../components/ReportDetailsForm';
import ReportConfirmation from '../components/ReportConfirmation';

// Importación de iconos (puedes cambiar estos si deseas usar otros específicos para calles)
import inundacionIcon from '../assets/icons/inundacion.svg';
import caidaescalerasIcon from '../assets/icons/caidaescaleras.svg';
import fugadegasIcon from '../assets/icons/fugadegas.svg';
import cortocircuitoIcon from '../assets/icons/cortocircuito.svg';

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

// Servicios disponibles (puedes modificar las opciones según las necesidades del reporte de calles)
const STREET_SERVICES: Service[] = [
  { id: 'Inundacion', label: 'Inundacion', icon: inundacionIcon },
  { id: 'caidaescaleras', label: 'Caída de Escaleras', icon: caidaescalerasIcon },
  { id: 'fugadegas', label: 'Fuga de Gas', icon: fugadegasIcon },
  { id: 'cortocircuito', label: 'Cortocircuito', icon: cortocircuitoIcon },
];

export default function ReporteCalles() {
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
            services={STREET_SERVICES}
            title="Servicios brindados en las CALLES"
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
            onSuccess={() => setCurrentStep(4)} // Redirige al paso 4 cuando se envía correctamente
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
