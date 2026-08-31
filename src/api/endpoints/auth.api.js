import api from "../axios";

export const authApi = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);

    console.log(data, "returned");

    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  // ==========================================
  // CURRENT AUTHENTICATED USER
  // ==========================================

  getMe: async () => {
    const { data } = await api.get("/users/me", {
      withCredentials: true,
    });

    return data;
  },

  // ==========================================
  // OTP
  // ==========================================

  verifyOTP: async (payload) => {
    const { data } = await api.post("/auth/verify-otp", payload);
    return data;
  },

  resendOTP: async (payload) => {
    const { data } = await api.post("/auth/resend-otp", payload);
    return data;
  },

  // ==========================================
  // PASSWORD
  // ==========================================

  forgotPassword: async (payload) => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload) => {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  },

  // ==========================================
  // INVITATION
  // ==========================================

  acceptInvite: async (payload) => {
    const { data } = await api.post(
      "/auth/accept-invitation",
      payload
    );

    return data;
  },

  // ==========================================
  // USER PROFILE
  // ==========================================

  getProfile: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },
};