import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authApi";
import { User } from "../models/models";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../utils/tokenUtils";
import { logout as serviceLogout } from "../services/authActions";

export const useAuthProvider = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(getAccessToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    serviceLogout();
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const initAuth = async () => {
      const access = getAccessToken();
      const refresh = getRefreshToken();

      if (!refresh) {
        setLoading(false);
        return;
      }

      try {
        let currentAccess = access;
        if (!currentAccess) {
          const res = await AuthApi.refresh();
          currentAccess = res.accessToken;
          saveTokens(currentAccess, refresh);
        }

        const currentUser = await AuthApi.getCurrentUser();

        console.log("render");
        setToken(currentAccess);
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { accessToken, refreshToken, user } = await AuthApi.login({
          email,
          password,
        });
        saveTokens(accessToken, refreshToken);
        setToken(accessToken);
        setUser(user);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await AuthApi.register({ name, email, password });
      await login(email, password);
    },
    [login]
  );

  const refresh = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const res = await AuthApi.refresh();
      saveTokens(res.accessToken, refreshToken);
      setToken(res.accessToken);
    } catch {
      logout();
    }
  }, [logout]);

  const setAuth = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      saveTokens(accessToken, refreshToken);
      setToken(accessToken);
      setUser(user);
    },
    []
  );

  const loginWithProvider = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      setAuth(accessToken, refreshToken, user);
      navigate("/dashboard");
    },
    [setAuth, navigate]
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
    loginWithProvider,
  };
};
