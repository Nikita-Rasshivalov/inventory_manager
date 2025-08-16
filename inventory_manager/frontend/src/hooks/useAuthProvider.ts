import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";
import { User } from "../models/models";
import { logout as serviceLogout } from "../services/authActions";
import { useAuthTokens } from "./useAuthTokens";

export const useAuthProvider = () => {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const { token, setTokens, clearAuth, refreshToken } = useAuthTokens();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    serviceLogout();
    navigate("/login");
  }, [clearAuth, navigate]);

  useEffect(() => {
    if (initialized) return;

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
  }, [initialized, token, refreshToken, logout, setTokens]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { accessToken, refreshToken, user } = await AuthApi.login({
          email,
          password,
        });
        setTokens(accessToken, refreshToken);
        setUser(user);
        navigate("/dashboard");
      } catch (err: any) {
        const message =
          err?.response?.data?.error || err?.message || "Login failed";
        throw new Error(message);
      }
    },
    [navigate, setTokens]
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
    (accessToken: string, refreshToken: string, user: User) => {
      setTokens(accessToken, refreshToken);
      setUser(user);
    },
    [setTokens]
  );

  return {
    token,
    user,
    loading,
    login,
    register,
    logout,
    refresh,
    setAuth,
  };
};
