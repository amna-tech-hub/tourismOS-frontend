import api from "../axios";

export const companyApi = {
  // ==========================================
  // COMPANY DASHBOARD
  // ==========================================

  getDashboard: async (period = 30) => {
    const response = await api.get(
      `/company/dashboard?period=${period}`
    );

    return response.data;
  },

  // ==========================================
  // COMPANY PROFILE
  // ==========================================

  getProfile: async () => {
    const { data } = await api.get("/company/profile");
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.patch(
      "/company/profile",
      payload
    );

    return data;
  },

  // ==========================================
  // AI CREDIT HISTORY
  // ==========================================

  getCreditHistory: async () => {
    const { data } = await api.get(
      "/company/dashboard/credit-history"
    );

    return data;
  },

  // ==========================================
  // COMPANY BOOKINGS
  // ==========================================

  getBookings: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      paymentStatus = "",
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

    if (paymentStatus && paymentStatus !== "all") {
      queryParams.append(
        "paymentStatus",
        paymentStatus
      );
    }

    if (sort) {
      queryParams.append("sort", sort);
    }

    if (order) {
      queryParams.append("order", order);
    }

    const { data } = await api.get(
      `/company/bookings?${queryParams.toString()}`
    );

    return data;
  },

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  updateBookingStatus: async ({ id, status }) => {
    const { data } = await api.patch(
      `/company/bookings/${id}`,
      { status }
    );

    return data;
  },
};