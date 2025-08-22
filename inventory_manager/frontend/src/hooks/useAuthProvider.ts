import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";
import { logout as serviceLogout } from "../services/authActions";
import { useAuthTokens } from "./useAuthTokens";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuthProvider = () => {
  const navigate = useNavigate();
  const { token, setTokens, clearAuth, refreshToken } = useAuthTokens();

  const { user, setUser, initialized, setInitialized } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    serviceLogout();
    navigate("/login");
  }, [clearAuth, navigate, setUser]);

  useEffect(() => {
    if (initialized) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      if (!refreshToken) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        let currentAccess = token;
        if (!currentAccess) {
          const res = await AuthApi.refresh();
          currentAccess = res.accessToken;
          setTokens(currentAccess, refreshToken);
        }

        const currentUser = await AuthApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, [
    initialized,
    token,
    refreshToken,
    logout,
    setTokens,
    setUser,
    setInitialized,
  ]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken, refreshToken, user } = await AuthApi.login({
        email,
        password,
      });
      setTokens(accessToken, refreshToken);
      setUser(user);
      navigate("/dashboard");
    },
    [navigate, setTokens, setUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await AuthApi.register({ name, email, password });
      await login(email, password);
    },
    [login]
  );

  const refresh = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const res = await AuthApi.refresh();
      setTokens(res.accessToken, refreshToken);
    } catch {
      logout();
    }
  }, [refreshToken, logout, setTokens]);

  const setAuth = useCallback(
    (accessToken: string, refreshToken: string, user: any) => {
      setTokens(accessToken, refreshToken);
      setUser(user);
    },
    [setTokens, setUser]
  );

  return { token, user, loading, login, register, logout, refresh, setAuth };
};
