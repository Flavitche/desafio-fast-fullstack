import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginRequest } from '../api';

const AuthContext = createContext(null);

function decodeUsuario(token) {
  try {
    // JWT usa base64url (troca "+" por "-" e "/" por "_", e omite o
    // preenchimento "="). atob() só entende base64 padrão, então
    // normalizamos antes de decodificar.
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const preenchido = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(preenchido));
    return payload.unique_name || payload.name || payload.sub || 'admin';
  } catch {
    return 'admin';
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fast_token'));
  const [usuario, setUsuario] = useState(() => localStorage.getItem('fast_user'));

  const login = useCallback(async (usuarioInput, senha) => {
    const receivedToken = await loginRequest(usuarioInput, senha);
    const nome = decodeUsuario(receivedToken) || usuarioInput;
    localStorage.setItem('fast_token', receivedToken);
    localStorage.setItem('fast_user', nome);
    setToken(receivedToken);
    setUsuario(nome);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fast_token');
    localStorage.removeItem('fast_user');
    setToken(null);
    setUsuario(null);
  }, []);

  const value = { token, usuario, isAuthenticated: Boolean(token), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}