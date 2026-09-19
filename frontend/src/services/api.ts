import axios from 'axios';
import { handleMockRequest } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinelx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If network error, offline, or server unreachable, fallback to client-side simulation engine
    if (!error.response || error.code === 'ERR_NETWORK' || error.response?.status >= 500 || error.response?.status === 404) {
      const mock = handleMockRequest(error.config);
      if (mock) {
        return Promise.resolve(mock);
      }
    }

    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        localStorage.removeItem('sentinelx_token');
        localStorage.removeItem('sentinelx_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
