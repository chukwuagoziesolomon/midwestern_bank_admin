import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Log API base URL in development
if (import.meta.env.DEV) {
  console.log('🔌 API Base URL:', API_BASE);
}

const api = axios.create({
  baseURL: API_BASE,
});

export const authApi = {
  signup: (data) => api.post('/signup/', data),
  login: (data) => api.post('/login/', data),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users/'),
  getUserDetails: (id) => api.get(`/admin/users/${id}/`),
  approveUser: (id, startDate = null, endDate = null) => {
    const data = { action: 'approve' };
    if (startDate) data.start_date = startDate;
    if (endDate) data.end_date = endDate;
    return api.post(`/admin/users/${id}/approve/`, data);
  },
  rejectUser: (id) => api.post(`/admin/users/${id}/approve/`, { action: 'reject' }),
  resetTransfers: (id) => api.post(`/admin/users/${id}/reset-transfers/`),
  deleteUser: (id) => api.post(`/admin/users/${id}/delete/`),
};

export default api;
