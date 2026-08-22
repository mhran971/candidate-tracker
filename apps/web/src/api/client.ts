import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL;
const baseURL = rawBaseURL
  ? rawBaseURL.replace(/\/+$/, '')
  : '/api';

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
