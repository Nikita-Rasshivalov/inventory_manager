import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthApi } from "../api/authApi";
import { logout as serviceLogout } from "../services/authActions";
import { useAuthTokens } from "./useAuthTokens";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuthProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setTokens, clearAuth, refreshToken } = useAuthTokens();
  const { user, setUser, initialized, setInitialized } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    serviceLogout();
    navigate("/login");
  }, [clearAuth, navigate, setUser]);

  const initAuth = useCallback(async () => {
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
  }, [refreshToken, token, setTokens, setUser, logout, setInitialized]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken");
    const refreshTokenParam = query.get("refreshToken");

    if (accessToken && refreshTokenParam) {
      (async () => {
        try {
          setTokens(accessToken, refreshTokenParam);
          const currentUser = await AuthApi.getCurrentUser();
          setUser(currentUser);
          navigate("/dashboard", { replace: true });
        } catch {
          logout();
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      })();
      return;
    }

    if (!initialized) {
      initAuth();
    } else {
      setLoading(false);
    }
  }, [
    location.search,
    initialized,
    initAuth,
    setTokens,
    setUser,
    logout,
    navigate,
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
    [setTokens, setUser, navigate]
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
  }, [refreshToken, setTokens, logout]);

  const setAuth = useCallback(
    (accessToken: string, refreshTokenParam: string, user: any) => {
      setTokens(accessToken, refreshTokenParam);
      setUser(user);
    },
    [setTokens, setUser]
  );

  return { token, user, loading, login, register, logout, refresh, setAuth };
};
