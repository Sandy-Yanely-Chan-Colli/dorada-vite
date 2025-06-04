import { useState } from 'react';
import styles from './ReporteAlbercas.module.css';
import ServiceSelection from '../components/ServiceSelection';
import type { Service } from '../components/ServiceSelection';
import PersonalDataForm from '../components/PersonalDataForm';
import ReportDetailsForm from '../components/ReportDetailsForm';
import ReportConfirmation from '../components/ReportConfirmation';

// Íconos específicos para reporte de GIMNASIO (subidos por ti)
import limpiezaIcon from '../assets/icons/limpieza.svg';        // file-8zjQ7nxzzFS5qLd23oVipQ
import seguridadIcon from '../assets/icons/seguridad.svg';      // file-XMViaZHKrbMTKFBgzjQx7X
import maintenanceIcon from '../assets/icons/maintenance.svg';// file-1Cub73SDRHNZfB3dC1bEg9
import equipodañadooinservibleIcon from '../assets/icons/equipodañadooinservible.svg';              // file-XJ5E6rQLa4JVpkBFZz5jAy

// Estructura del formulario
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

// Servicios para GIMNASIO
const GYM_SERVICES: Service[] = [
  { id: 'limpieza', label: 'Limpieza', icon: limpiezaIcon },
  { id: 'seguridad', label: 'Seguridad', icon: seguridadIcon },
  { id: 'maintenance', label: 'Mantenimiento', icon: maintenanceIcon },
  { id: 'equipodañadooinservible', label: 'Equipo dañado o inservible', icon: equipodañadooinservibleIcon },
];

export default function ReporteGimnasia() {
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
            services={GYM_SERVICES}
            title="Servicios brindados en el GIMNASIO"
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
