import { useState } from 'react';
import styles from './ReporteAlbercas.module.css';
import ServiceSelection from '../components/ServiceSelection';
import type { Service } from '../components/ServiceSelection';
import PersonalDataForm from '../components/PersonalDataForm';
import ReportDetailsForm from '../components/ReportDetailsForm';
import ReportConfirmation from '../components/ReportConfirmation';

// Nuevos servicios para Reporte de Canchas
import dañoengradasobancasIcon from '../assets/icons/dañoengradasobancas.svg';
import superficieIcon from '../assets/icons/superficie.svg';
import redIcon from '../assets/icons/red.svg';
import vandalismoIcon from '../assets/icons/vandalismo.svg';



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

// Servicios disponibles para canchas
const COURT_SERVICES: Service[] = [
  { id: 'dañoengradasobancas', label: 'Daño en gradas o bancas', icon: dañoengradasobancasIcon },
  { id: 'superficie', label: 'Superficie de la cancha', icon: superficieIcon },
  { id: 'red', label: 'Red de la cancha', icon: redIcon },
  { id: 'vandalismo', label: 'Vandalismo', icon: vandalismoIcon }
];

export default function ReporteCanchas() {
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
//Datas
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
            services={COURT_SERVICES}
            title="Servicios brindados en las CANCHAS"
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
