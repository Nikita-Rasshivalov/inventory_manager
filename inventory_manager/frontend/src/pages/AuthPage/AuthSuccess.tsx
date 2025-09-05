import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SystemRole } from "../../models/models";
import { Loader } from "lucide-react";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

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
        imageUrl: "",
        theme: "light",
      });
    }
    navigate("/dashboard", { replace: true });
  }, [navigate, setAuth]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
      <span className="ml-2 text-lg font-semibold">Redirecting...</span>
    </div>
  );
};

export default AuthSuccess;
