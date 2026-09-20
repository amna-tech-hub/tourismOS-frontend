// src/hooks/useEmployee.js
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { employeeApi } from "../endpoints/employee.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

// ==========================================
// TOURS
// ==========================================

// Get all my tours
export const useMyTours = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.TOURS_LIST(params),

    queryFn: () => employeeApi.getMyTours(params),

    staleTime: 1000 * 60 * 5,

    // Keep current tours visible while
    // search / filter / pagination is fetching
    placeholderData: keepPreviousData,
  });
};

// Get single tour
export const useMyTour = (tourId) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.TOUR_DETAIL(tourId),

    queryFn: () => employeeApi.getMyTourById(tourId),

    enabled: !!tourId,

    staleTime: 1000 * 60 * 5,
  });
};

// Create tour
export const useCreateMyTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => employeeApi.createTour(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOURS,
      });

      // Also refresh dashboard
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.DASHBOARD,
      });
    },
  });
};

// Update tour
export const useUpdateMyTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      employeeApi.updateMyTour({ id, ...payload }),

    onSuccess: (_, variables) => {
      // Refresh tour detail
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOUR_DETAIL(variables.id),
      });

      // Refresh tour lists
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOURS,
      });
    },
  });
};

// Publish tour
export const usePublishMyTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId) => employeeApi.publishMyTour(tourId),

    onSuccess: (_, tourId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOUR_DETAIL(tourId),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOURS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.DASHBOARD,
      });
    },
  });
};

// Delete tour
export const useDeleteMyTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId) => employeeApi.deleteMyTour(tourId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.TOURS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.DASHBOARD,
      });
    },
  });
};

// ==========================================
// DASHBOARD
// ==========================================

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.DASHBOARD,

    queryFn: () => employeeApi.getDashboardStats(),

    staleTime: 1000 * 60 * 2, // 2 minutes (dashboard changes frequently)
  });
};

// ==========================================
// BOOKINGS
// ==========================================

// Get bookings for my tours
export const useMyTourBookings = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.BOOKINGS_LIST(params),

    queryFn: () => employeeApi.getMyTourBookings(params),

    staleTime: 1000 * 60 * 5,

    placeholderData: keepPreviousData,
  });
};

// Get booking details
export const useBookingDetails = (bookingId) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.BOOKING_DETAIL(bookingId),

    queryFn: () => employeeApi.getBookingDetails(bookingId),

    enabled: !!bookingId,

    staleTime: 1000 * 60 * 5,
  });
};

// Get booking stats
export const useBookingStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.BOOKING_STATS,

    queryFn: () => employeeApi.getBookingStats(),

    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// REVIEWS
// ==========================================

// Get reviews for my tours
export const useMyTourReviews = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.REVIEWS_LIST(params),

    queryFn: () => employeeApi.getMyTourReviews(params),

    staleTime: 1000 * 60 * 5,

    placeholderData: keepPreviousData,
  });
};

// Get rating statistics
export const useRatingStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.RATING_STATS,

    queryFn: () => employeeApi.getRatingStats(),

    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// PROFILE
// ==========================================

// Get my profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.PROFILE,

    queryFn: () => employeeApi.getMyProfile(),

    staleTime: 1000 * 60 * 10,
  });
};

// Update my profile
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => employeeApi.updateMyProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EMPLOYEE.PROFILE,
      });
    },
  });
};

// Get my company details
export const useMyCompany = () => {
  return useQuery({
    queryKey: QUERY_KEYS.EMPLOYEE.COMPANY,

    queryFn: () => employeeApi.getMyCompany(),

    staleTime: 1000 * 60 * 10,
  });
};


// ======================================================
// GET MY TOURS
// ======================================================

// export const useMyTours = (params = {}) => {
//   return useQuery({
//     queryKey: employeeTourKeys.list(params),
//     queryFn: async () => {
//       const { data } = await api.get("/employee/tours", { params });
//       return data;
//     },
//     keepPreviousData: true,
//     staleTime: 30000,
//   });
// };

// ======================================================
// GET SINGLE TOUR
// ======================================================

// export const useMyTour = (id) => {
//   return useQuery({
//     queryKey: employeeTourKeys.detail(id),
//     queryFn: async () => {
//       const { data } = await api.get(`/employee/tours/${id}`);
//       return data;
//     },
//     enabled: !!id,
//   });
// };

// ======================================================
// GET TOUR DETAILS (with safety)
// ======================================================

export const useMyTourDetails = (id) => {
  return useQuery({
    queryKey: [...employeeTourKeys.detail(id), "details"],
    queryFn: async () => {
      const { data } = await api.post("/employee/tours/details", { id });
      return data;
    },
    enabled: !!id,
  });
};

// ======================================================
// CREATE TOUR
// ======================================================

// export const useCreateMyTour = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (tourData) => {
//       const { data } = await api.post("/employee/tours", tourData);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: employeeTourKeys.lists() });
//     },
//   });
// };

// ======================================================
// UPDATE TOUR
// ======================================================

// export const useUpdateMyTour = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, data: tourData }) => {
//       const { data } = await api.put(`/employee/tours/${id}`, tourData);
//       return data;
//     },
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: employeeTourKeys.lists() });
//       queryClient.invalidateQueries({
//         queryKey: employeeTourKeys.detail(variables.id),
//       });
//     },
//   });
// };

// ======================================================
// PUBLISH TOUR
// ======================================================

// export const usePublishMyTour = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id) => {
//       const { data } = await api.patch(`/employee/tours/${id}/publish`);
//       return data;
//     },
//     onSuccess: (_, id) => {
//       queryClient.invalidateQueries({ queryKey: employeeTourKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: employeeTourKeys.detail(id) });
//     },
//   });
// };

// ======================================================
// DELETE TOUR
// ======================================================

// export const useDeleteMyTour = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id) => {
//       const { data } = await api.delete(`/employee/tours/${id}`);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: employeeTourKeys.lists() });
//     },
//   });
// };