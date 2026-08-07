import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../endpoints/company.api';
import { QUERY_KEYS } from '../../constants/queryKeys';

// Fetch Company Dashboard Data
export const useCompanyDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.DASHBOARD,
    queryFn: companyApi.getDashboard,
  });
};

// Fetch Company Profile
export const useCompanyProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.PROFILE,
    queryFn: companyApi.getProfile,
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

// Fetch Credit History
export const useCreditHistory = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.CREDIT_HISTORY,
    queryFn: companyApi.getCreditHistory,
  });
};