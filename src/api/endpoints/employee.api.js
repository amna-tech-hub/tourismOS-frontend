// src/api/endpoints/employee.api.js
import api from "../axios";

export const employeeApi = {
  // ==========================================
  // TOURS (Employee's own tours)
  // ==========================================

  // Create a new tour
  createTour: async (payload) => {
    const { data } = await api.post("employee/tours", payload);
    return data;
  },

  // Get all my tours (with pagination, search, filter)
  getMyTours: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sort = "createdAt",
      order = "desc",
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (status && status !== "all") {
      queryParams.append("status", status);
    }

    if (sort) {
      queryParams.append("sort", sort);
    }

    if (order) {
      queryParams.append("order", order);
    }

    const url = `employee/tours?${queryParams.toString()}`;
    const response = await api.get(url);

    return response.data;
  },

  // Get single tour by ID
  getMyTourById: async (id) => {
    const { data } = await api.get(`employee/tours/${id}`);
    return data;
  },

  // Update tour
  updateMyTour: async ({ id, ...payload }) => {
    const { data } = await api.patch(`employee/tours/${id}`, payload);
    return data;
  },

  // Publish tour
  publishMyTour: async (id) => {
    const { data } = await api.patch(`employee/tours/${id}/publish`);
    return data;
  },

  // Delete tour (soft delete)
  deleteMyTour: async (id) => {
    const { data } = await api.delete(`employee/tours/${id}`);
    return data;
  },

  // ==========================================
  // DASHBOARD
  // ==========================================

  // Get dashboard stats (tours, bookings, ratings, reviews)
  getDashboardStats: async () => {
    const { data } = await api.get("employee/dashboard/stats");
    return data;
  },

  // ==========================================
  // BOOKINGS (for my tours)
  // ==========================================

  // Get all bookings for my tours
  getMyTourBookings: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      tourId = "",
      sort = "createdAt",
      order = "desc",
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (status && status !== "all") {
      queryParams.append("status", status);
    }

    if (tourId) {
      queryParams.append("tourId", tourId);
    }

    if (sort) {
      queryParams.append("sort", sort);
    }

    if (order) {
      queryParams.append("order", order);
    }

    const url = `employee/bookings?${queryParams.toString()}`;
    const response = await api.get(url);

    return response.data;
  },

  // Get booking details
  getBookingDetails: async (id) => {
    const { data } = await api.get(`employee/bookings/${id}`);
    return data;
  },

  // Get booking stats (by status)
  getBookingStats: async () => {
    const { data } = await api.get("employee/bookings/stats");
    return data;
  },

  // ==========================================
  // REVIEWS (for my tours)
  // ==========================================

  // Get all reviews for my tours
  getMyTourReviews: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      rating = "",
      tourId = "",
      sort = "createdAt",
      order = "desc",
    } = params;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (rating) {
      queryParams.append("rating", rating);
    }

    if (tourId) {
      queryParams.append("tourId", tourId);
    }

    if (sort) {
      queryParams.append("sort", sort);
    }

    if (order) {
      queryParams.append("order", order);
    }

    const url = `employee/reviews?${queryParams.toString()}`;
    const response = await api.get(url);

    return response.data;
  },

  // Get rating statistics
  getRatingStats: async () => {
    const { data } = await api.get("employee/reviews/stats");
    return data;
  },

  // ==========================================
  // PROFILE
  // ==========================================

  // Get my profile
  getMyProfile: async () => {
    const { data } = await api.get("employee/profile");
    return data;
  },

  // Update my profile
  updateMyProfile: async (payload) => {
    const { data } = await api.patch("employee/profile", payload);
    return data;
  },

  // Get my company details
  getMyCompany: async () => {
    const { data } = await api.get("employee/profile/company");
    return data;
  },
};