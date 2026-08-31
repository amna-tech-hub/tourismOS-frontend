import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../endpoints/company.api';
import { QUERY_KEYS } from '../../constants/queryKeys';

// Fetch Company Dashboard Data (Refetches every 5 seconds)
export const useCompanyDashboard = (period = 30) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMPANY.DASHBOARD, period],

    queryFn: () => companyApi.getDashboard(period),

    refetchInterval: false,
  });
};
// Fetch Company Profile (Refetches every 5 seconds)
export const useCompanyProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.PROFILE,
    queryFn: companyApi.getProfile,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

// Update Company Profile Mutation
export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANY.PROFILE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANY.DASHBOARD });
    },
  });
};

// Fetch Credit History (Refetches every 5 seconds)
export const useCreditHistory = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.CREDIT_HISTORY,
    queryFn: companyApi.getCreditHistory,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

// ==========================================
// COMPANY BOOKING HOOKS
// ==========================================

// Fetch Company Bookings
export const useCompanyBookings = (params = {}) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.COMPANY.BOOKINGS,
      params,
    ],

    queryFn: () => companyApi.getBookings(params),

    staleTime: 1000 * 60 * 2,
  });
};


// Update Booking Status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      companyApi.updateBookingStatus({
        id,
        status,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMPANY.BOOKINGS,
      });

      // Dashboard numbers can also change
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMPANY.DASHBOARD,
      });
    },
  });
};