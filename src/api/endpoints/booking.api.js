// api/endpoints/booking.api.js
import api from '../axios';

export const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData,{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Get booking details
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = '') => {
    const response = await api.delete(`/bookings/${bookingId}`, {
      data: { reason } // Some APIs use data field for DELETE body
    });
    return response.data;
  },

  // Confirm booking after payment
  confirmBooking: async (paymentId) => {
    const response = await api.post(`/bookings/confirm/${paymentId}`);
    return response.data;
  },

  // Bulk update booking status (for admin/company)
  bulkUpdateStatus: async ({ bookingIds, status }) => {
    const response = await api.patch('/bookings/bulk', {
      bookingIds,
      status
    });
    return response.data;
  }
};