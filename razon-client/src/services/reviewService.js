import api from './api';

export const fetchReviews = () => api.get('/reviews');
export const createReview = (review) => api.post('/reviews', review);
export const updateReview = (id, review) => api.put(`/reviews/${id}`, review);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
