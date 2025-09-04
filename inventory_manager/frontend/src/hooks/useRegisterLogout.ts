import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../utils/tokenUtils";
import { registerLogout } from "../services/authActions";

export const useRegisterLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    registerLogout(() => {
      clearAuthData();
      navigate("/login");
    });
  }, [navigate]);
};
