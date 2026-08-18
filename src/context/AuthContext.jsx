import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { userService } from "../services/token.service";

import {
  useCurrentAuthUser,
  useLogout,
} from "../api/queries/useAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ==========================================
  // RESTORE CACHED USER
  // ==========================================

  const [user, setUser] = useState(() =>
    userService.getUser()
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