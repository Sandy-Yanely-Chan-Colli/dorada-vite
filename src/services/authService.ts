import type { 
  ApiAuthResponse,
  AuthResponse,
  StoredAuthData,
  UserData 
} from '../types/authTypes';

const API_URL = import.meta.env.VITE_API_URL || '';

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
    token: rawData.Token,
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
    
    return {
      token: parsed.token || parsed.Token,
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

// Obtener headers con token para peticiones autenticadas
export const getAuthHeaders = (): HeadersInit => {
  const authData = getAuthData();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData?.token || ''}`
  };
};

// ---------------------------
// Registro de nuevo usuario
// ---------------------------
export interface RegistroCompletoRequest {
  FullName: string;
  Rkey: string;
  Phone: string;
  Email: string;
  NombreUsuario: string;
  Contraseña: string;
  EsAdmin: boolean;
}

export const registrarUsuario = async (datos: RegistroCompletoRequest): Promise<any> => {
  const response = await fetch(`${API_URL}/auth/registro-completo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }

  return await response.json();
};
