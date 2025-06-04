import api from './api';

export interface ReportData {
  tipoServicio: string;
  titulo: string;
  descripcion: string;
  area?: string;
  fechaIncidente?: string;
  imagenUrl?: string;
  nombreCompleto: string;
  rkey: string;
  email?: string;
  telefono?: string;
}

export const createReport = async (reportData: Omit<ReportData, 'id'>) => {
  try {
    const response = await api.post('/reportes', {
      ...reportData,
      fechaIncidente: reportData.fechaIncidente || new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/reportes/uploadimage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const response = await api.get('/reportes');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};