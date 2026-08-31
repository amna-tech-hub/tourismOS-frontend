import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationApi } from "../endpoints/notification.api";
import { QUERY_KEYS } from "../../constants/queryKeys";


// ==========================================
// QUERY KEYS
// ==========================================



// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const useNotifications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION_KEYS.ALL,
    queryFn: notificationApi.getNotifications,
  });
};


// ==========================================
// UNREAD COUNT
// ==========================================

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION_KEYS.UNREAD_COUNT,
    queryFn: notificationApi.getUnreadCount,
  });
};


// ==========================================
// SAVE FCM TOKEN
// ==========================================

export const useSaveFcmToken = () => {
  return useMutation({
    mutationFn: notificationApi.saveToken,
  });
};


// ==========================================
// REMOVE FCM TOKEN
// ==========================================

export const useRemoveFcmToken = () => {
  return useMutation({
    mutationFn: notificationApi.removeToken,
  });
};


// ==========================================
// MARK AS READ
// ==========================================

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION_KEYS.ALL,
      });

      queryClient.invalidateQueries({
        queryKey:QUERY_KEYS.NOTIFICATION_KEYS.UNREAD_COUNT,
      });
    },
  });
};


// ==========================================
// MARK ALL AS READ
// ==========================================

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:QUERY_KEYS.NOTIFICATION_KEYS.ALL,
      });

      queryClient.invalidateQueries({
        queryKey:QUERY_KEYS. NOTIFICATION_KEYS.UNREAD_COUNT,
      });
    },
  });
};