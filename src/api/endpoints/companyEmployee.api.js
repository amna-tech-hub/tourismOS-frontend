import api from "../axios";

export const companyEmployeeApi = {
  // ==========================================
  // EMPLOYEES
  // ==========================================

  // Invite / create employee
  inviteEmployee: async (payload) => {
    const { data } = await api.post("company/employees", payload);
    return data;
  },

  // Get all employees belonging to company
  getEmployees: async (params = {}) => {
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

    const url = `company/employees?${queryParams.toString()}`;

    const response = await api.get(url);

    return response.data;
  },

  // Get single employee
  getEmployeeById: async (id) => {
    const { data } = await api.get(`company/employees/${id}`);
    return data;
  },

  // Update employee
  updateEmployee: async ({ id, ...payload }) => {
    const { data } = await api.patch(`company/employees/${id}`, payload);
    return data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const { data } = await api.delete(`company/employees/${id}`);
    return data;
  },
};