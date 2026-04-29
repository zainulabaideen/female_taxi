import axios from 'axios';

const BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:4343';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Auto-attach JWT token for user or admin
api.interceptors.request.use((config) => {
  // Admin routes
  if (config.url?.startsWith('/api/admin')) {
    const adminToken = localStorage.getItem('admintoken');
    if (adminToken) config.headers['Authorization'] = `Bearer ${adminToken}`;
  } else {
    const token = localStorage.getItem('shego_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401/403 for user
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url?.includes('/api/admin')) {
      localStorage.removeItem('shego_token');
      localStorage.removeItem('shego_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  loginUser: (data) => api.post('/api/auth/login', data),
  loginAdmin: (data) => api.post('/api/auth/admin/login', data),
  signupPassenger: (data) => api.post('/api/auth/signup/passenger', data),
  signupDriver: (formData) => api.post('/api/auth/signup/driver', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMe: () => api.get('/api/auth/me'),
};

// ─── Driver ───────────────────────────────────────────────────────────────────
export const driverAPI = {
  getProfile: () => api.get('/api/drivers/profile'),
  updateProfile: (data) => api.put('/api/drivers/profile', data),

  // ─── Availability (New Date-Based System) ───
  getAvailability: () => api.get('/api/drivers/availability'),
  addAvailability: (data) => api.post('/api/drivers/availability', data),
  deleteAvailability: (slotId) => api.delete(`/api/drivers/availability/${slotId}`),

  // ─── Pricing ───
  getRates: () => api.get('/api/drivers/rates'),
  setRates: (data) => api.put('/api/drivers/rates', data),
  getDiscounts: () => api.get('/api/drivers/discounts'),
  addDiscount: (data) => api.post('/api/drivers/discounts', data),
  removeDiscount: (discountId) => api.delete(`/api/drivers/discounts/${discountId}`),

  // ─── Offers (Bidding) ───
  getIncomingOffers: () => api.get('/api/drivers/offers/incoming'),
  getActiveOffers: () => api.get('/api/drivers/offers/active'),
  createOffer: (data) => api.post('/api/drivers/offers/create', data),
  respondToOffer: (offerId, response, offered_fare) =>
    api.post(`/api/drivers/offers/${offerId}/respond`, { response, offered_fare }),

  // ─── Ride Management ───
  startDriving: (bookingId, latitude, longitude) =>
    api.post(`/api/drivers/ride/${bookingId}/start`, { latitude, longitude }),
  doneDriving: (bookingId) => api.post(`/api/drivers/ride/${bookingId}/done`),
  updateLocation: (bookingId, latitude, longitude) =>
    api.post(`/api/drivers/ride/${bookingId}/location`, { latitude, longitude }),

  // ─── Public driver list (passengers view) ───
  getAllDrivers: () => api.get('/api/drivers/all'),
  getDriverAvailableSlots: (driverId) => api.get(`/api/drivers/${driverId}/available-slots`),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
  createBooking: (data) => api.post('/api/bookings', data),
  getMyBookings: () => api.get('/api/bookings/my'),
  getDriverBookings: () => api.get('/api/bookings/driver'),
  cancelBooking: (bookingId) => api.put(`/api/bookings/${bookingId}/cancel`),
  updateBookingStatus: (bookingId, status) => api.put(`/api/bookings/${bookingId}/status`, { status }),
  getBookingById: (bookingId) => api.get(`/api/bookings/${bookingId}`),

  // ─── Ride Offers (Bidding System) ───
  requestOffers: (data) => api.post('/api/bookings/offers/request', data),
  getMyOffers: () => api.get('/api/bookings/offers/my'),
  acceptOffer: (offerId) => api.post(`/api/bookings/offers/${offerId}/accept`),
};

// ─── Reports & SOS ───────────────────────────────────────────────────────────
export const reportAPI = {
  createReport: (data) => api.post('/api/reports', data),
  getMyReports: () => api.get('/api/reports/my'),
  triggerSOS: (data) => api.post('/api/reports/sos', data),
  getMySOS: () => api.get('/api/reports/sos/my'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getAllUsers: (role) => api.get('/api/admin/users', { params: { role } }),
  updateUserStatus: (userId, status) => api.put(`/api/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  getPendingDrivers: () => api.get('/api/admin/drivers/pending'),
  reviewDriver: (driverId, action, note) => api.put(`/api/admin/drivers/${driverId}/review`, { action, note }),
  getAllBookings: () => api.get('/api/admin/bookings'),
  getAllReports: () => api.get('/api/admin/reports'),
  updateReportStatus: (reportId, status, admin_note) => api.put(`/api/admin/reports/${reportId}/status`, { status, admin_note }),
  getAllSOS: () => api.get('/api/admin/sos'),
  resolveSOS: (sosId) => api.put(`/api/admin/sos/${sosId}/resolve`),
};
