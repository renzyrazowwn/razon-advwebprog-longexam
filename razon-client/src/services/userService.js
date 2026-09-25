import api from './api';

export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userInfo) => api.post('/users/register', userInfo);

// Admin only
export const fetchUsers = () => api.get('/users');

// Self or Admin
export const fetchUserById = (id) => api.get(`/users/${id}`);
export const createUser = (user) => api.post('/users', user);

// Admin (any user) or the user themself
export const updateUser = (id, updates) => api.put(`/users/${id}`, updates);
export const deleteUser = (id) => api.delete(`/users/${id}`);
