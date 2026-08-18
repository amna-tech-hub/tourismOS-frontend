import api from '../axios';

export const authApi = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    console.log(data," returned");
    
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } =api.get('/auth/me', { withCredentials: true });
    return data;
  },
  
    verifyOTP: async (payload) => {
      const { data } = await api.post("/auth/verify-otp", payload);
      return data;
    },
  
    resendOTP: async (payload) => {
      const { data } = await api.post("/auth/resend-otp", payload);
      return data;
    },
  
  
    forgotPassword: async (payload) => {
      const { data } = await api.post("/auth/forgot-password", payload);
      return data;
    },
  
    resetPassword: async (payload) => {
      const { data } = await api.post("/auth/reset-password", payload);
      return data;
    },
  
    acceptInvite: async (payload) => {
      const { data } = await api.post("/auth/accept-invitation", payload);
      return data;
    },
  
    getProfile: async () => {
      const { data } = await api.get("/users/me");
      return data;
    },
  
    updateProfile: async (payload) => {
      const { data } = await api.patch("/users/me", payload);
      return data;
    },
  
};