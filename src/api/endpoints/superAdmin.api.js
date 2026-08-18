import api from '../axios';

export const superAdminApi = {
  // Get all companies with search, pagination, and filters
  getCompanies: async (params = {}) => {
    const { data } = await api.get('/admin/companies', { params });
    return data;
  },

  // Get single company details
  getCompanyById: async (id) => {
    const { data } = await api.get(`/admin/companies/${id}`);
    return data;
  },

  // Create new company and trigger invitation email
  createCompany: async (payload) => {
    const { data } = await api.post('/admin/companies', payload);
    return data;
  },

  // Update company information
  updateCompany: async ({ id, ...payload }) => {
    const { data } = await api.patch(`/admin/companies/${id}`, payload);
    return data;
  },

  // Suspend company account
  suspendCompany: async (id) => {
    const { data } = await api.patch(`/admin/companies/${id}/suspend`);
    return data;
  },

  // Activate company account
  activateCompany: async (id) => {
    const { data } = await api.patch(`/admin/companies/${id}/activate`);
    return data;
  },

  // Soft delete company
  deleteCompany: async (id) => {
    const { data } = await api.delete(`/admin/companies/${id}`);
    return data;
  },

  // Get individual company metrics
  getCompanyStats: async (id) => {
    const { data } = await api.get(`/admin/companies/${id}/stats`);
    return data;
  },

  // Get payment fraud attempt analysis
  getFraudAttempts: async () => {
    const { data } = await api.get('/admin/fraud-attempts');
    return data;
  },

   getAdminDashboardRevenue: async () => {
    const { data } = await api.get('admin/dashboard/revenue');
    return data;
  },

    getCompanyOverview: async () => {
    const { data } = await api.get('admin/dashboard/company-overview');
    return data;
  },
    getBookingOverview: async () => {
    const { data } = await api.get('admin/dashboard/booking-overview');
    return data;
  },
      getPlatformStats: async () => {
    const { data } = await api.get('admin/dashboard/platform-stats');
    return data;
  },

      getAnalysis: async () => {
    const { data } = await api.get('admin/dashboard/platform-analysis');
    return data;
  },

  getUsers: async (params = {}) => {
    const { data } = await api.get("/users", { params });
    return data;
  },

  getUserById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  getUserStats: async (id) => {
    const { data } = await api.get(`/users/${id}/stats`);
    return data;
  },


  updateUserRole: async (id, roleId) => {
    const { data } = await api.patch(`/users/${id}/role`, { roleId });
    return data;
  },

  toggleEmailVerification: async (id, emailVerified) => {
    const { data } = await api.patch(`/users/${id}/verify-email`, { emailVerified });
    return data;
  },

  softDeleteUser: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  restoreUser: async (id) => {
    const { data } = await api.patch(`/users/${id}/restore`);
    return data;
  },

  getRoles: async () => {
    const { data } = await api.get("/users/roles");
    return data;
  },

  getPlans: async () => {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  // Company: Create Checkout Session
  createCheckoutSession: async (payload) => {
    const response = await api.post('/subscription/checkout', payload);
    return response.data;
  },

  // Super Admin: Get All Plans
  getAllPlansAdmin: async () => {
    const response = await api.get('/subscription/admin/plans');
    return response.data;
  },

  // Super Admin: Create Plan
  createPlan: async (planData) => {
    const response = await api.post('/subscription/admin/plans', planData);
    return response.data;
  },

  // Super Admin: Update Plan
 // Super Admin: Update Plan
updatePlan: async (id, planData) => {
  const response = await api.put(
    `/subscription/admin/plans/${id}`,
    planData
  );

  return response.data;
},

  // Super Admin: Toggle Active Status
  togglePlanStatus: async (id) => {
    const response = await api.patch(`/subscription/admin/plans/${id}/toggle`);
    return response.data;
  },

  // Super Admin: Get Company Subscriptions Ledger
  getCompanySubscriptions: async () => {
    const response = await api.get('/subscription/admin/company-subscriptions');
    return response.data;
  },
  // Tours & Reviews Management
getTourAnalytics: async () => {
  const response = await api.get('/admin/dashboard/tours/analytics');
  return response.data;
},

deleteAdminReview: async (reviewId) => {
  const response = await api.delete(`/admin/dashboard/tours/reviews/${reviewId}`);
  return response.data;
},


};