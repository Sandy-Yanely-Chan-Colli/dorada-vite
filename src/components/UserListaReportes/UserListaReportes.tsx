import { useEffect, useState } from 'react';
import styles from './UserListaReportes.module.css';
import { getAuthData, getAuthHeaders } from '../../services/authService';
import Navbar from '../../components/Navbar/Navbar';

interface Reporte {
  Id: number;
  Titulo: string;
  Descripcion: string;
  Area: string;
  WaitingTime?: string;
  Schedule?: string;
  ImagenUrl?: string;
  UsuarioId: number;
  FechaCreacion: string;
  Estado: string;
  CredencialUsuario?: string;
}

export default function UserListaReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [edicionId, setEdicionId] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const reportesPorPagina = 5;

  const auth = getAuthData();

  const fetchReportes = async () => {
    try {
      const res = await fetch('https://localhost:7200/api/Reportes', {
        headers: getAuthHeaders(),
      });
      const data: Reporte[] = await res.json();

      const soloUsuario = data.filter((r) => r.UsuarioId === auth?.Usuario.Id);
      setReportes(soloUsuario);
    } catch (err) {
      console.error('Error al obtener reportes del usuario:', err);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const eliminarReporte = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este reporte?')) return;
    try {
      const res = await fetch(`https://localhost:7200/api/Reportes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setReportes(prev => prev.filter(r => r.Id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const iniciarEdicion = (id: number, estadoActual: string) => {
    setEdicionId(id);
    setNuevoEstado(estadoActual);
  };

  const guardarEstado = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7200/api/Reportes/${id}/estado`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Estado: nuevoEstado })
      });
      if (res.ok) {
        setReportes(prev =>
          prev.map(r => (r.Id === id ? { ...r, Estado: nuevoEstado } : r))
        );
        setEdicionId(null);
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const reportesFiltrados = reportes.filter(r =>
    r.Titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.Area.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.Estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(reportesFiltrados.length / reportesPorPagina);
  const indiceInicio = (paginaActual - 1) * reportesPorPagina;
  const reportesPaginados = reportesFiltrados.slice(indiceInicio, indiceInicio + reportesPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.titulo}>Mis Reportes</h2>

        <input
          type="text"
          className={styles.buscador}
          placeholder="Buscar por título, área o estado"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Área</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportesPaginados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No se encontraron reportes</td>
              </tr>
            ) : (
              reportesPaginados.map(reporte => (
                <tr key={reporte.Id}>
                  <td>{reporte.Titulo}</td>
                  <td>{reporte.Area}</td>
                  <td>
                    {edicionId === reporte.Id ? (
                      <input
                        type="text"
                        value={nuevoEstado}
                        onChange={(e) => setNuevoEstado(e.target.value)}
                      />
                    ) : (
                      reporte.Estado
                    )}
                  </td>
                  <td>{new Date(reporte.FechaCreacion).toLocaleDateString()}</td>
                  <td className={styles.botones}>
                    {edicionId === reporte.Id ? (
                      <button onClick={() => guardarEstado(reporte.Id)} className={styles.modificar}>Guardar</button>
                    ) : (
                      <button onClick={() => iniciarEdicion(reporte.Id, reporte.Estado)} className={styles.modificar}>Modificar</button>
                    )}
                    <button onClick={() => eliminarReporte(reporte.Id)} className={styles.eliminar}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className={styles.paginacion}>
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
