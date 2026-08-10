import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../endpoints/auth.api';
import { userService } from '../../services/token.service';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.user) {
        userService.setUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.user) {
        userService.setUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      userService.removeUser();
      queryClient.clear();
    },
  });
};

// Fixed: Wrapped in custom hook functions
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload) => authApi.verifyOTP(payload),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (payload) => authApi.resendOTP(payload),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload) => authApi.forgotPassword(payload),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload) => authApi.resetPassword(payload),
  });
};

export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (payload) => authApi.acceptInvite(payload),
  });
};

// Check active session on app boot via httpOnly cookie
export const useCurrentAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};