import { useNavigate } from 'react-router-dom';
import styles from './AreaCard.module.css';

interface AreaCardProps {
  title: string;
  imageSrc: string;
  description: string;
  ruta: string; // Propiedad simple para la ruta
}

const AreaCard = ({ title, imageSrc, description, ruta }: AreaCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ruta); // Navega directamente a la ruta especificada
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <h3>{title}</h3>
      <div className={styles.cardContent}>
        <div className={styles.cardImage}>
          <img src={imageSrc} alt={title} />
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AreaCard;