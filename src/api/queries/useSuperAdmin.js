import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminApi } from '../endpoints/superAdmin.api';
import { QUERY_KEYS } from '../../constants/queryKeys';

export const useSuperAdminCompanies = (params) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANIES(params),
    queryFn: () => superAdminApi.getCompanies(params),
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
  });
};

export const useFraudAttempts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.FRAUD_ATTEMPTS,
    queryFn: superAdminApi.getFraudAttempts,
  });}

  export const useAdminDashboardRevenue = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.DASHBOARD_REVENUE,
    queryFn: superAdminApi.getAdminDashboardRevenue,
  })}

   export const useCompanyOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.COMPANY_OVERVIEW,
    queryFn: superAdminApi.getCompanyOverview,
  })}

  export const useBookingOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.BOOKING_OVERVIEW,
    queryFn: superAdminApi.getBookingOverview,
  })}

  export const usePlatformStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.getPlatformStats,
    queryFn: superAdminApi.getPlatformStats,
  })
  }

  export const useSuperAdminUsers = (queryParams = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USERS(queryParams),
    queryFn: () => superAdminApi.getUsers(queryParams),
    placeholderData: (previousData) => previousData, // TanStack Query v5 equivalent of keepPreviousData
  });
};

// Hook to fetch single user details by ID
export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(userId),
    queryFn: () => superAdminApi.getUserById(userId),
    enabled: !!userId,
  });
};

// Hook to fetch detailed user stats (role-aware: traveler spending, company metrics, etc.)
export const useUserStats = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.USER_STATS(userId),
    queryFn: () => superAdminApi.getUserStats(userId),
    enabled: !!userId,
  });
};

// Hook to fetch available system roles for filter dropdowns
export const useRoles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPER_ADMIN.ROLES,
    queryFn: () => superAdminApi.getRoles(),
    staleTime: 1000 * 60 * 60, // Cache roles for 1 hour
  });
};

// Hook to update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleId }) => superAdminApi.updateUserRole(id, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['super-admin', 'users'],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(variables.id),
      });
    },
  });
};

// Hook to toggle user email verification
export const useToggleEmailVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, emailVerified }) => superAdminApi.toggleEmailVerification(id, emailVerified),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['super-admin', 'users'],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPER_ADMIN.USER_DETAIL(variables.id),
      });
    },
  });
};

// Hook to soft-delete a user account
export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => superAdminApi.softDeleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['super-admin', 'users'],
      });
    },
  });
};

// Hook to restore a soft-deleted user account
export const useRestoreUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => superAdminApi.restoreUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['super-admin', 'users'],
      });
    },
  });
};
