import { useState } from "react";
import Socials from "../components/common/Socials";
import RegisterForm from "../components/Froms/RegisterForm";
import LoginForm from "../components/Froms/LoginForm";
import Button from "../components/common/Button";
const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="max-w-sm w-full bg-white p-10 rounded-md shadow-lg transition-all duration-300">
        <div className="flex justify-center mb-6 space-x-4">
          <Button
            onClick={() => handleModeChange("register")}
            active={mode === "register"}
          >
            Sign Up
          </Button>

          <Button
            onClick={() => handleModeChange("login")}
            active={mode === "login"}
          >
            Sign In
          </Button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <LoginForm
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <RegisterForm
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        <div className="mt-5">
          <p className="text-center text-gray-600 mb-3">
            Or {mode === "login" ? "sign in" : "sign up"} with
          </p>
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
