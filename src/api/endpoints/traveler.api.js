import api from "../axios";

export const travelerApi = {
  // ==========================================
  // JOURNALS
  // ==========================================
  createJournal: async (payload) => {
    const { data } = await api.post("/travel-journals", payload);
    return data;
  },

  getMyJournals: async () => {
    const { data } = await api.get("/travel-journals");
    return data;
  },

updateJournalEntry: async ({
  id,
  entryId,
  day,
  title,
  memory,
  photos,
  expenses,
}) => {
  const { data } = await api.patch(
    `/travel-journals/${id}/entries/${entryId}`,
    {
      day,
      title,
      memory,
      photos,
      expenses,
    }
  );

  return data;
},
  getJournalById: async (id) => {
    const { data } = await api.get(`/travel-journals/${id}`);
    return data;
  },

  addJournalEntry: async ({ id, ...payload }) => {
    const { data } = await api.post(`/travel-journals/${id}/entries`, payload);
    return data;
  },


  deleteJournalEntry: async ({ id, entryId }) => {
    const { data } = await api.delete(`/travel-journals/${id}/entries/${entryId}`);
    return data;
  },

  deleteJournal: async (id) => {
    const { data } = await api.delete(`/travel-journals/${id}`);
    return data;
  },

  // ==========================================
  // TOURS & AI PREVIEW FLOW
  // ==========================================

  generateTourPreview: async (payload) => {
    const { data } = await api.post("/tours/generate-preview", payload);
    return data;
  },

  // Step 2: Final Submit (Creates the tour after review/edits)
  createTour: async (payload) => {
    const { data } = await api.post("/tours", payload);
    return data;
  },

  // Generate cover image via AI
  generateCoverImage: async (payload) => {
    const { data } = await api.post("/tours/generate-cover-image", payload);
    return data;
  },

  // Get all public tours (for frontend showcase)
getPublicTours: async (params = {}) => {
  const {
    page = 1,
    limit = 8,
    search = "",
    provider = "",
    minPrice = "",
    maxPrice = "",
    sort = "createdAt",
    order = "desc",
    companyId = "",
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.append("page", page);
  queryParams.append("limit", limit);

  // Search
  if (search.trim()) {
    queryParams.append("search", search.trim());
  }

  // Company filter
  if (companyId) {
    queryParams.append("companyId", companyId);
  }

  // Provider
  // Backend expects `platform`
  if (provider && provider !== "all") {
    queryParams.append("platform", provider);
  }

  // Price filters
  if (minPrice !== "") {
    queryParams.append("minPrice", minPrice);
  }

  if (maxPrice !== "") {
    queryParams.append("maxPrice", maxPrice);
  }

  // Sorting
  queryParams.append("sort", sort);
  queryParams.append("order", order);

  const { data } = await api.get(
    `/tours?${queryParams.toString()}`
  );

  return data;
},
// Publish draft tour
publishTour: async (id) => {
  const { data } = await api.patch(
    `/tours/${id}/publish`
  );

  return data;
},
  // Get company-specific tours
 // Get company-specific tours
getCompanyTours: async (params = {}) => {
  const {
    page = 1,
    limit = 9,
    search = "",
    status = "",
    sort = "createdAt",
    order = "desc",
    companyId = "",
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

  if (companyId) {
    queryParams.append("companyId", companyId);
  }

  const url = `/tours/company?${queryParams.toString()}`;

  console.log("GET TOURS URL:", url);

  const response = await api.get(url);

  console.log("GET TOURS RESPONSE:", response.data);

  return response.data;
},

  // Get single tour by ID
  getTourById: async (id) => {
    const { data } = await api.get(`/tours/${id}`);
    return data;
  },

 
  // Update an existing tour
  updateTour: async ({ id, ...payload }) => {
    const { data } = await api.patch(`/tours/${id}`, payload);
    return data;
  },

  // Soft delete tour
  deleteTour: async (id) => {
    const { data } = await api.delete(`/tours/${id}`);
    return data;
  },

  // Check tour safety
  checkTourSafety: async (payload) => {
    
    const { data } = await api.post("tours/tour-detail", payload);
    return data;
  },

  // ==========================================
  // TOUR REVIEWS
  // ==========================================
  createReview: async (payload) => {
    const { data } = await api.post("/tour/review", payload);
    return data;
  },

  getTourReviews: async (tourId) => {
    const { data } = await api.get(`/tour/review/${tourId}`);
    return data;
  },

  deleteReview: async (reviewId) => {
    const { data } = await api.delete(`/tour/review/delete/${reviewId}`);
    return data;
  },
};