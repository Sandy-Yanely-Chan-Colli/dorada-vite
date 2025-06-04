import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import AreaCard from '../../components/AreaCard/AreaCard';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const areas = [
    { 
      title: 'Spa', 
      imageSrc: 'spa.png', 
      description: 'Reportes del área de Spa',
      ruta: '/reporte-spa' 
    },
    { 
      title: 'Gym', 
      imageSrc: 'gym.png', 
      description: 'Reportes del gimnasio',
      ruta: 'reporte-gym' 
    },
    { 
      title: 'Canchas', 
      imageSrc: 'cancha.png', 
      description: 'Reportes de canchas deportivas',
      ruta: '/reporte-canchas' 
    },
    { 
      title: 'Albercas', 
      imageSrc: 'albercas.png', 
      description: 'Reportes de albercas',
      ruta: '/reporte-albercas' 
    },
    { 
      title: 'Calle', 
      imageSrc: 'calle.png', 
      description: 'Reportes de áreas exteriores',
      ruta: '/reporte-calles' 
    },
    { 
      title: 'Entrada', 
      imageSrc: 'entrada.png', 
      description: 'Reportes de la entrada principal',
      ruta: '/reporte-entrada' 
    }
  ];

  return (
    <div className={styles.homeContainer}>
      <Header />
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.welcomeMessage}>
          <h2>¿En qué podemos ayudar?</h2>
          <p>No dude en crear su reporte</p>
        </div>
        
        <div className={styles.cardsContainer}>
          {areas.map((area, index) => (
            <AreaCard
              key={index}
              title={area.title}
              imageSrc={area.imageSrc}
              description={area.description}
              ruta={area.ruta}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;