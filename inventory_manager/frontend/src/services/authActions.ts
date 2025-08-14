import { clearAuthData } from "../utils/tokenUtils";

let logoutFn: (() => void) | null = null;

export const registerLogout = (fn: () => void) => {
  logoutFn = fn;
};

export const logout = () => {
  if (logoutFn) {
    logoutFn();
  } else {
    clearAuthData();
    window.location.href = "/login";
  }
};
