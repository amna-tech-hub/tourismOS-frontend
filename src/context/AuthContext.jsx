import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/token.service';
import { useCurrentAuthUser, useLogout } from '../api/queries/useAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userService.getUser());
  const { data: authData, isLoading: isCheckingAuth, isError } = useCurrentAuthUser();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (authData?.user) {
      setUser(authData.user);
      userService.setUser(authData.user);
    } else if (isError) {
      setUser(null);
      userService.removeUser();
    }
  }, [authData, isError]);

  const loginUser = (response) => {
    const userData = response.user || response.data?.user;
    if (userData) {
      setUser(userData);
      userService.setUser(userData);
    }
  };

  const logoutUser = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};