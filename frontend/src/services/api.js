import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF token to request headers
api.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
});

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events/'),
  getBySlug: (slug) => api.get(`/events/${slug}/`),
  create: (data) => api.post('/events/', data),
  update: (slug, data) => api.put(`/events/${slug}/`, data),
  delete: (slug) => api.delete(`/events/${slug}/`),
};

// Attendees API
export const attendeesAPI = {
  register: (slug, data) => api.post(`/events/${slug}/register/`, data),
  getByEvent: (slug) => api.get(`/events/${slug}/attendees/`),
  markAttendance: (data) => api.post('/attendees/mark-attendance/', data),
  getByHash: (hash) => api.get(`/attendees/verify-hash/?hash=${hash}`),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login/', credentials),
  logout: () => api.post('/admin/logout/'),
};

export default api;
