import api from "../axios";

export const travelerApi = {
  

  createJournal: async (payload) => {
    const { data } = await api.post("/journals", payload);
    return data;
  },

  getMyJournals: async () => {
    const { data } = await api.get("/journals/my-journals");
    return data;
  },

  getJournalById: async (id) => {
    const { data } = await api.get(`/journals/${id}`);
    return data;
  },

  addJournalEntry: async ({ id, ...payload }) => {
    const { data } = await api.post(`/journals/${id}/entries`, payload);
    return data;
  },

  updateJournal: async ({ id, ...payload }) => {
    const { data } = await api.patch(`/journals/${id}`, payload);
    return data;
  },

  deleteJournalEntry: async ({ id, entryId }) => {
    const { data } = await api.delete(`/journals/${id}/entries/${entryId}`);
    return data;
  },

  deleteJournal: async (id) => {
    const { data } = await api.delete(`/journals/${id}`);
    return data;
  },
// getALL tours

  getAllTour: async (tourId) => {
    const { data } = await api.get(`/tours`);
    return data;
  },
  // ==========================================
  // TOUR REVIEWS
  // ==========================================
  createReview: async (payload) => {
    const { data } = await api.post("/reviews", payload);
    return data;
  },

  getTourReviews: async (tourId) => {
    const { data } = await api.get(`/reviews/tour/${tourId}`);
    return data;
  },

  deleteReview: async (reviewId) => {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
  },
};