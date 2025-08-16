import { useState, useCallback } from "react";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearAuthData,
} from "../utils/tokenUtils";

export const useAuthTokens = () => {
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshToken()
  );

  const setTokens = useCallback(
    (accessToken: string, newRefreshToken: string) => {
      saveTokens(accessToken, newRefreshToken);
      setToken(accessToken);
      setRefreshToken(newRefreshToken);
    },
    []
  );

  const clearAuth = useCallback(() => {
    clearAuthData();
    setToken(null);
    setRefreshToken(null);
  }, []);

  return { token, setTokens, clearAuth, refreshToken };
};
