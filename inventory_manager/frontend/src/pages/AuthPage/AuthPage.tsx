import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/layout/Header";
import Socials from "../../components/common/Socials";
import LoginForm from "../../components/Froms/LoginForm";
import RegisterForm from "../../components/Froms/RegisterForm";
import Button from "../../components/common/Button";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
  };
  const handleError = (message: string) => {
    if (!message) return;
    toast.error(message);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex flex-1 items-center  justify-center bg-gray-200 px-4">
        <div className="w-full max-w-sm bg-white p-10 rounded-md shadow-lg transition-all duration-300 mx-auto">
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

          {mode === "login" ? (
            <LoginForm
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <RegisterForm
              onError={handleError}
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
      </main>
    </div>
  );
};

export default AuthPage;
