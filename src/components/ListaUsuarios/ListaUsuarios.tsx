import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Usuarios.module.css';
import { getAuthHeaders, getAuthData } from '../../services/authService';
import NavDashboard from '../NavDashboard/NavDashboard';

interface Usuario {
  Id: number;
  NombreCompleto: string;
  Rkey: string;
  Email: string;
  Telefono: string;
  NombreUsuario: string;
  EsAdmin: boolean;
  Activo: boolean;
}

const USUARIOS_POR_PAGINA = 5;

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtrados, setFiltrados] = useState<Usuario[]>([]);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const navigate = useNavigate();
  const authData = getAuthData();

  useEffect(() => {
    // Protege la ruta si no está autenticado o no es admin
    if (!authData || !authData.Usuario?.EsAdmin) {
      navigate('/login', { replace: true });
      return;
    }

    const obtenerUsuarios = async () => {
      try {
        const res = await fetch('https://localhost:7200/api/Auth/usuarios', {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Error al obtener usuarios');
        const data = await res.json();
        setUsuarios(data);
        setFiltrados(data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerUsuarios();
  }, [authData, navigate]);

  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const resultados = usuarios.filter(usuario =>
      usuario.NombreCompleto.toLowerCase().includes(texto) ||
      usuario.Rkey.toLowerCase().includes(texto) ||
      usuario.NombreUsuario.toLowerCase().includes(texto) ||
      usuario.Telefono.toLowerCase().includes(texto) ||
      usuario.Email.toLowerCase().includes(texto) ||
      (usuario.EsAdmin ? 'administrador' : 'usuario').includes(texto)
    );
    setFiltrados(resultados);
    setPaginaActual(1);
  }, [busqueda, usuarios]);

  const eliminarUsuario = (id: number) => {
    console.log(`Eliminar usuario con ID ${id}`);
  };

  const modificarUsuario = (id: number) => {
    console.log(`Modificar usuario con ID ${id}`);
  };

  const totalPaginas = Math.ceil(filtrados.length / USUARIOS_POR_PAGINA);
  const inicio = (paginaActual - 1) * USUARIOS_POR_PAGINA;
  const usuariosPagina = filtrados.slice(inicio, inicio + USUARIOS_POR_PAGINA);

  return (
    <div>
      <NavDashboard />
      <div className={styles.container}>
        <h2 className={styles.titulo}>Lista de Usuarios</h2>

        <div className={styles.filtros}>
          <input
            type="text"
            className={styles.buscador}
            placeholder="Buscar por nombre, Rkey, usuario, correo, teléfono o rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {usuariosPagina.length === 0 ? (
          <p className={styles.mensaje}>No se encontraron usuarios.</p>
        ) : (
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rkey</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.map(usuario => (
                <tr key={usuario.Id}>
                  <td>{usuario.NombreCompleto}</td>
                  <td>{usuario.NombreUsuario}</td>
                  <td>{usuario.Email}</td>
                  <td>{usuario.Telefono}</td>
                  <td>{usuario.Rkey}</td>
                  <td>{usuario.EsAdmin ? 'Administrador' : 'Usuario'}</td>
                  <td className={usuario.Activo ? styles.activo : styles.inactivo}>
                    {usuario.Activo ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className={styles.botones}>
                    <button onClick={() => modificarUsuario(usuario.Id)} className={styles.modificar}>Modificar</button>
                    <button onClick={() => eliminarUsuario(usuario.Id)} className={styles.eliminar}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPaginas > 1 && (
          <div className={styles.paginacion}>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                className={`${styles.pagina} ${paginaActual === i + 1 ? styles.activa : ''}`}
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
