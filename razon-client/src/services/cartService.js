import api from './api';

// The API doesn't scope GET /carts to the logged-in user, so callers
// filter the response by userId client-side.
export const fetchCarts = () => api.get('/carts');
export const createCart = (cart) => api.post('/carts', cart);
export const updateCart = (id, cart) => api.put(`/carts/${id}`, cart);
export const deleteCart = (id) => api.delete(`/carts/${id}`);
