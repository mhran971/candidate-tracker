import axios from 'axios';

const getBaseURL = () => {
  // In production (Netlify), use relative '/api' unless an explicit non-localhost production API is specified
  if (import.meta.env.PROD) {
    if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
      const url = import.meta.env.VITE_API_URL;
      return url.endsWith('/api') ? url : `${url}/api`;
    }
    return '/api';
  }

  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    return url.endsWith('/api') ? url : `${url}/api`;
  }

  return 'http://localhost:3001/api';
};

const baseURL = getBaseURL();

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server error message from standard API error format
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject(new Error(customMessage));
  }
);
