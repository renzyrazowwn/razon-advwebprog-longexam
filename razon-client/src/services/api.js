import axios from 'axios';

const HOST = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Shared axios instance. Every service builds its own resource path off this.
const api = axios.create({
  baseURL: `${HOST}/v1`,
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bulldogex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server tells us the session is dead, clear it out so the UI
// falls back to a logged-out state instead of getting stuck.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bulldogex_token');
      localStorage.removeItem('bulldogex_user');
    }
    return Promise.reject(error);
  }
);

// Turns whatever the server (or axios itself) threw into one readable
// string, so every page can handle Authentication / Authorization /
// Validation / Server errors the same way.
export const getErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;
    if (status === 401) return 'You need to sign in to do that.';
    if (status === 403) return "You don't have permission to do that.";
    if (status === 404) return 'That could not be found.';
    if (status >= 500) return 'Something went wrong on the server. Please try again.';
    return 'Something went wrong with that request.';
  }
  if (error.request) return 'Could not reach the server. Check your connection and try again.';
  return error.message || 'Something went wrong.';
};

export default api;
