import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useForegroundNotifications } from "../api/queries/useForegroundNotifications";
import { userService } from "../services/token.service";
import { registerFcmToken } from "../services/notification.service";
import { useSaveFcmToken } from "../api/queries/useNotifications";
import {
  useCurrentAuthUser,
  useLogout,
} from "../api/queries/useAuth";
import toast from 'react-hot-toast';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ==========================================
  // RESTORE CACHED USER
  // ==========================================
const saveFcmTokenMutation = useSaveFcmToken();
  const [user, setUser] = useState(() =>
    userService.getUser()
  );
useEffect(() => {
  if (!user) return;

  registerFcmToken(
    saveFcmTokenMutation.mutateAsync
  );
}, [user]);
const queryClient = useQueryClient();

const handleForegroundNotification = useCallback(
  (payload) => {
    console.log(
      "[Notification] Foreground notification:",
      payload
    );

    const title =
      payload.notification?.title || "TourismOS";

    const body =
      payload.notification?.body || "";

    toast(
      <div>
        <p className="font-semibold">{title}</p>
        {body && (
          <p className="text-sm mt-1">{body}</p>
        )}
      </div>
    );

    queryClient.invalidateQueries({
      queryKey:QUERY_KEYS. NOTIFICATION_KEYS.ALL,
    });

    queryClient.invalidateQueries({
      queryKey:QUERY_KEYS.NOTIFICATION_KEYS.UNREAD_COUNT,
    });
  },
  [queryClient]
);

useForegroundNotifications(
  handleForegroundNotification
);

  // ==========================================
  // CHECK HTTP-ONLY SESSION
  // ==========================================

  const {
    data: authData,
    isLoading: isCheckingAuth,
  } = useCurrentAuthUser();

  const logoutMutation = useLogout();

  // ==========================================
  // SYNC SERVER USER
  // ==========================================

  useEffect(() => {
    if (authData?.user) {
      setUser(authData.user);
      userService.setUser(authData.user);
    }
  }, [authData]);

  // ==========================================
  // LOGIN
  // ==========================================

  const loginUser = (response) => {
    const userData =
      response?.user ||
      response?.data?.user;

    if (userData) {
      setUser(userData);
      userService.setUser(userData);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();

      setUser(null);
      userService.removeUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated: !!user,

        role: user?.role || null,

        isCheckingAuth,

        loginUser,

        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};