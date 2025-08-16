import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SystemRole } from "../models/models";
import Loader from "../components/common/Loader";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = params.get("name");

    if (accessToken && refreshToken) {
      setAuth(accessToken, refreshToken, {
        name: name || "",
        id: 0,
        email: "",
        role: SystemRole.USER,
      });

      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate, setAuth]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => navigate("/dashboard"), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
      <span className="ml-2 text-lg font-semibold">Redirecting...</span>
    </div>
  );
};

export default AuthSuccess;
