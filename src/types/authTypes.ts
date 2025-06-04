export interface UserData {
  Id: number;
  NombreUsuario: string;
  FullName?: string;
  Rkey?: string;
  Phone?: string;
  Email?: string;
  EsAdmin?: boolean;
}

export interface ApiAuthResponse {
  Token: string; // Respuesta de la API (mayúscula)
  Usuario: UserData;
}

export interface AuthResponse {
  token: string; // Versión normalizada (minúscula)
  Usuario: UserData;
}

export interface StoredAuthData {
  token: string;
  Usuario: UserData;
}