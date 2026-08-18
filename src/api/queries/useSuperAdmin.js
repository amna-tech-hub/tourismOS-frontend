import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi } from '../endpoints/superAdmin.api';
import { QUERY_KEYS } from '../../constants/queryKeys';

// =========================================================
// COMPANIES
// =========================================================

export const useSuperAdminCompanies = (params) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANIES(params),
    queryFn: () => superAdminApi.getCompanies(params),
    refetchInterval: 5000,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminApi.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'companies'] });
    },
  });
};

export const useSuspendCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminApi.suspendCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'companies'] });
    },
  });
};

export const useActivateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminApi.activateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'companies'] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminApi.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'companies'] });
    },
  });
};

export const useCompanyStats = (companyId) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANY_STATS(companyId),
    queryFn: () => superAdminApi.getCompanyStats(companyId),
    enabled: !!companyId,
    refetchInterval: 5000,
  });
};

// =========================================================
// USERS
// =========================================================

export const useSuperAdminUsers = (queryParams = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USERS(queryParams),
    queryFn: () => superAdminApi.getUsers(queryParams),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
  });
};

export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(userId),
    queryFn: () => superAdminApi.getUserById(userId),
    enabled: !!userId,
    refetchInterval: 5000,
  });
};

export const useUserStats = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USER_STATS(userId),
    queryFn: () => superAdminApi.getUserStats(userId),
    enabled: !!userId,
    refetchInterval: 5000,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.ROLES,
    queryFn: () => superAdminApi.getRoles(),
    staleTime: 1000 * 60 * 60,
    refetchInterval: 5000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleId }) => superAdminApi.updateUserRole(id, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(variables.id) });
    },
  });
};

export const useToggleEmailVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, emailVerified }) => superAdminApi.toggleEmailVerification(id, emailVerified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(variables.id) });
    },
  });
};

export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => superAdminApi.softDeleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
    },
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => superAdminApi.restoreUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
    },
  });
};

// =========================================================
// SUBSCRIPTIONS & PLANS
// =========================================================

export const useAdminSubscriptionPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.SUBSCRIPTION_PLANS,
    queryFn: superAdminApi.getAllPlansAdmin,
    refetchInterval: 5000,
  });
};

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: superAdminApi.createSubscriptionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMIN.SUBSCRIPTION_PLANS });
    },
  });
};
export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...planData }) =>
      superAdminApi.updatePlan(id, planData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPER_ADMIN.SUBSCRIPTION_PLANS,
      });
    },
  });
};

export const useToggleSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => superAdminApi.togglePlanStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMIN.SUBSCRIPTION_PLANS });
    },
  });
};

export const useCompanySubscriptionsLedger = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANY_SUBSCRIPTIONS,
    queryFn: superAdminApi.getCompanySubscriptions,
    refetchInterval: 5000,
  });
};
export const useAdminTours = (params) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.ADMIN_TOURS(params),
    queryFn: () => travelerApi.getCompanyTours(params),
  });
};

// =========================================================
// SECURITY, DASHBOARD & ANALYTICS
// =========================================================

export const useFraudAttempts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.FRAUD_ATTEMPTS,
    queryFn: superAdminApi.getFraudAttempts,
    refetchInterval: 5000,
  });
};

export const useAdminDashboardRevenue = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.DASHBOARD_REVENUE,
    queryFn: superAdminApi.getAdminDashboardRevenue,
    refetchInterval: 5000,
  });
};

export const useCompanyOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANY_OVERVIEW,
    queryFn: superAdminApi.getCompanyOverview,
    refetchInterval: 5000,
  });
};

export const useBookingOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.BOOKING_OVERVIEW,
    queryFn: superAdminApi.getBookingOverview,
    refetchInterval: 5000,
  });
};

export const usePlatformStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.PLATFORM_STATS,
    queryFn: superAdminApi.getPlatformStats,
    refetchInterval: 5000,
  });
};

export const useAnalysis = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.DASHBOARD_ANALYSIS,
    queryFn: superAdminApi.getAnalysis,
    refetchInterval: 5000,
  });
};

// tour
export const useTourAnalytics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.TOUR_ANALYTICS,
    queryFn: superAdminApi.getTourAnalytics,
    refetchInterval: 5000,
  });
};

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => superAdminApi.deleteAdminReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPER_ADMIN.TOUR_ANALYTICS,
      });
    },
  });
};