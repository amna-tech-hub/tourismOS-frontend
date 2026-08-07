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

// Check active session on app boot via httpOnly cookie
export const useCurrentAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};