import { useEffect, useState } from 'react';
import styles from './ListaReportes.module.css';
import { getAuthHeaders } from '../../services/authService';
import NavDashboard from '../NavDashboard/NavDashboard';

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

export default function ListaReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [edicionId, setEdicionId] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const reportesPorPagina = 5;

  useEffect(() => {
    fetch('https://localhost:7200/api/Reportes', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
      .then(res => res.json())
      .then(data => setReportes(data))
      .catch(err => console.error('Error al obtener reportes:', err));
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
      } else {
        console.error('No se pudo eliminar');
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
      } else {
        console.error('Error al actualizar estado');
      }
    } catch (err) {
      console.error('Error en PUT:', err);
    }
  };

  const reportesFiltrados = reportes.filter(r =>
    r.Titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.Area.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.Estado.toLowerCase().includes(busqueda.toLowerCase()) ||
    (r.CredencialUsuario?.toLowerCase() || '').includes(busqueda.toLowerCase())
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
      <NavDashboard />
      <div className={styles.container}>
        <h2 className={styles.titulo}>Reportes Enviados</h2>

        <input
          type="text"
          className={styles.buscador}
          placeholder="Buscar por título, área, estado o credencial..."
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
              <th>Usuario ID</th>
              <th>Credencial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportesPaginados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>No se encontraron reportes</td>
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
                  <td>{reporte.UsuarioId}</td>
                  <td>{reporte.CredencialUsuario || 'Desconocida'}</td>
                  <td className={styles.botones}>
                    {edicionId === reporte.Id ? (
                      <button className={styles.modificar} onClick={() => guardarEstado(reporte.Id)}>
                        Guardar
                      </button>
                    ) : (
                      <button className={styles.modificar} onClick={() => iniciarEdicion(reporte.Id, reporte.Estado)}>
                        Modificar
                      </button>
                    )}
                    <button className={styles.eliminar} onClick={() => eliminarReporte(reporte.Id)}>
                      Eliminar
                    </button>
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
