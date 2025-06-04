// src/services/authService.ts
import type{ 
  ApiAuthResponse,
  AuthResponse,
  StoredAuthData,
  UserData 
} from '../types/authTypes';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7200/api';

/**
 * Servicio de autenticación
 */
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NombreUsuario: username,
      Contraseña: password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error de autenticación');
  }

  const rawData: ApiAuthResponse = await response.json();

  // Normalización de Token (API) -> token (frontend)
  const authData: AuthResponse = {
    token: rawData.Token, // Conversión a minúscula
    Usuario: {
      Id: rawData.Usuario.Id,
      NombreUsuario: rawData.Usuario.NombreUsuario,
      FullName: rawData.Usuario.FullName,
      Rkey: rawData.Usuario.Rkey,
      Phone: rawData.Usuario.Phone,
      Email: rawData.Usuario.Email,
      EsAdmin: rawData.Usuario.EsAdmin
    }
  };

  saveAuthData(authData);
  return authData;
};

export const saveAuthData = (data: AuthResponse): void => {
  const dataToStore: StoredAuthData = {
    token: data.token,
    Usuario: {
      Id: data.Usuario.Id,
      NombreUsuario: data.Usuario.NombreUsuario,
      FullName: data.Usuario.FullName,
      Rkey: data.Usuario.Rkey,
      Phone: data.Usuario.Phone,
      Email: data.Usuario.Email,
      EsAdmin: data.Usuario.EsAdmin
    }
  };
  
  localStorage.setItem('authData', JSON.stringify(dataToStore));
};

export const getAuthData = (): StoredAuthData | null => {
  const data = localStorage.getItem('authData');
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    
    // Compatibilidad con mayúsculas/minúsculas
    return {
      token: parsed.token || parsed.Token, // Asegura compatibilidad
      Usuario: {
        Id: parsed.Usuario.Id,
        NombreUsuario: parsed.Usuario.NombreUsuario,
        FullName: parsed.Usuario.FullName || '',
        Rkey: parsed.Usuario.Rkey || '',
        Phone: parsed.Usuario.Phone || '',
        Email: parsed.Usuario.Email || '',
        EsAdmin: parsed.Usuario.EsAdmin || false
      }
    };
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem('authData');
};

export const isAuthenticated = (): boolean => {
  const authData = getAuthData();
  return !!authData?.token;
};

// Opcional: Función para obtener headers autenticados
export const getAuthHeaders = (): HeadersInit => {
  const authData = getAuthData();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData?.token || ''}`
  };
};