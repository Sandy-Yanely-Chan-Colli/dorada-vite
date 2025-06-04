import { useState } from 'react';
import styles from './ServiceSelection.module.css';

// Definimos el tipo Service primero
interface ServiceType {
  id: string;
  label: string;
  icon: string;
}

// Props del componente usando el tipo local
interface ServiceSelectionProps {
  services: ServiceType[];
  onSelect: (serviceId: string) => void;
  onNext: () => void;
  title?: string;
  nextButtonText?: string;
  disabled?: boolean;
  selectedService?: string | null;
  className?: string;
}

export default function ServiceSelection({
  services,
  onSelect,
  onNext,
  title = "Seleccione un servicio",
  nextButtonText = "Siguiente",
  disabled = false,
  selectedService: controlledSelectedService,
  className = ''
}: ServiceSelectionProps) {
  const [internalSelectedService, setInternalSelectedService] = useState<string | null>(null);
  
  const isControlled = controlledSelectedService !== undefined;
  const selectedService = isControlled ? controlledSelectedService : internalSelectedService;

  const handleSelect = (serviceId: string) => {
    if (!isControlled) {
      setInternalSelectedService(serviceId);
    }
    onSelect(serviceId);
  };

  return (
    <div className={`${styles.step} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.services}>
        {services.map((service) => (
          <div
            key={service.id}
            className={`${styles.service} ${
              selectedService === service.id ? styles.selected : ''
            }`}
            onClick={() => handleSelect(service.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(service.id)}
            aria-pressed={selectedService === service.id}
          >
            <img 
              src={service.icon} 
              alt={service.label} 
              className={styles.icon}
              loading="lazy"
            />
            <p className={styles.label}>{service.label}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={disabled || (!isControlled && !selectedService)}
        aria-disabled={disabled || (!isControlled && !selectedService)}
      >
        {nextButtonText}
      </button>
    </div>
  );
}

// Exportamos el tipo para uso externo
export type Service = ServiceType;