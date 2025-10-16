import axios from 'axios';
import { getToken } from '../storage/storage';  // ✅ platforma göre web/native otomatik seçilir

const API_BASE_URL = 'http://localhost:8000/';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
