import api from './api';

const toProductBody = (product, imageFile) => {
  if (!imageFile) return product;

  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== 'image') {
      formData.append(key, value);
    }
  });
  formData.append('image', imageFile);
  return formData;
};

// params: { search, category, minPrice, maxPrice, sort, page, limit }
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
// optional imageFile
export const createProduct = (product, imageFile) => api.post('/products', toProductBody(product, imageFile));
// optional imageFile (replaces the current image)
export const updateProduct = (id, product, imageFile) => api.put(`/products/${id}`, toProductBody(product, imageFile));
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// upload or replace only the image of an existing product
export const uploadProductImage = (id, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return api.post(`/products/${id}/upload-image`, formData);
};