import api from "../axios";

export const notificationApi = {
  // ==========================================
  // FCM TOKEN
  // ==========================================

  saveToken: async (fcmToken) => {
    const { data } = await api.post(
      "/notification/save-token",
      {
        fcmToken,
      }
    );

    return data;
  },

  removeToken: async (fcmToken) => {
    const { data } = await api.delete(
      "/notification/fcm-token",
      {
        data: { fcmToken },
      }
    );

    return data;
  },


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  getNotifications: async () => {
    const { data } = await api.get(
      "/notification"
    );

    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get(
      "/notification/unread-count"
    );

    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await api.patch(
      `/notification/${notificationId}/read`
    );

    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch(
      "/notification/read-all"
    );

    return data;
  },
};