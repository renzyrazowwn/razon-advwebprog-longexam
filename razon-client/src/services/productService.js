import api from './api';

// params: { search, category, minPrice, maxPrice, sort, page, limit }
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
