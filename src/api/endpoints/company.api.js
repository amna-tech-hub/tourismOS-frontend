import api from '../axios';

export const companyApi = {
 getDashboard: async (period = 30) => {
  const response = await api.get(
    `/company/dashboard?period=${period}`
  );

  return response.data;
},

  getProfile: async () => {
    const { data } = await api.get('/company/profile');
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.patch('/company/profile', payload);
    return data;
  },

  getCreditHistory: async () => {
    const { data } = await api.get('/company/dashboard/credit-history');
    return data;
  },
};