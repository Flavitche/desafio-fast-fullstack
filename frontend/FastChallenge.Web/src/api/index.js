import axios from 'axios';

/* ---------- Cliente HTTP ---------- */

// Base URL da API .NET. Ajuste no arquivo .env (veja .env.example) caso
// sua API rode em uma porta diferente de http://localhost:5123.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5123/api';

export const axiosClient = axios.create({ baseURL });

// Anexa o token JWT salvo no login em toda requisição.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fast_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar/for inválido, a API retorna 401 e deslogamos o usuário.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fast_token');
      localStorage.removeItem('fast_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ---------- Auth ---------- */

export async function login(usuario, senha) {
  const { data } = await axiosClient.post('/auth/login', { usuario, senha });
  return data.token;
}

/* ---------- Colaboradores ---------- */

const COLABORADORES_BASE = '/colaboradores';

export async function listarColaboradores() {
  const { data } = await axiosClient.get(COLABORADORES_BASE);
  return data;
}

export async function obterColaborador(id) {
  const { data } = await axiosClient.get(`${COLABORADORES_BASE}/${id}`);
  return data;
}

export async function criarColaborador(payload) {
  const { data } = await axiosClient.post(COLABORADORES_BASE, payload);
  return data;
}

export async function atualizarColaborador(id, payload) {
  const { data } = await axiosClient.put(`${COLABORADORES_BASE}/${id}`, payload);
  return data;
}

export async function excluirColaborador(id) {
  await axiosClient.delete(`${COLABORADORES_BASE}/${id}`);
}

/* ---------- Workshops ---------- */

const WORKSHOPS_BASE = '/workshops';

export async function listarWorkshops() {
  const { data } = await axiosClient.get(WORKSHOPS_BASE);
  return data;
}

export async function obterWorkshop(id) {
  const { data } = await axiosClient.get(`${WORKSHOPS_BASE}/${id}`);
  return data;
}

export async function criarWorkshop(payload) {
  const { data } = await axiosClient.post(WORKSHOPS_BASE, payload);
  return data;
}

export async function atualizarWorkshop(id, payload) {
  const { data } = await axiosClient.put(`${WORKSHOPS_BASE}/${id}`, payload);
  return data;
}

export async function excluirWorkshop(id) {
  await axiosClient.delete(`${WORKSHOPS_BASE}/${id}`);
}

// Ata de presença: vincula/remove um colaborador de um workshop.
export async function registrarPresenca(workshopId, colaboradorId) {
  const { data } = await axiosClient.post(`${WORKSHOPS_BASE}/${workshopId}/colaboradores/${colaboradorId}`);
  return data;
}

export async function removerPresenca(workshopId, colaboradorId) {
  await axiosClient.delete(`${WORKSHOPS_BASE}/${workshopId}/colaboradores/${colaboradorId}`);
}