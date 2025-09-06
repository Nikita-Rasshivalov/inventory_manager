import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import { isEmpty, isNullOrEmpty } from "../../utils/validators";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onError,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");

    if (isNullOrEmpty(email) || isEmpty(password)) {
      onError(t("fill_email_password"));
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      onError(err.response?.data?.error || err.message || t("login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="email"
        placeholder={t("email")}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
      />
      <Input
        type="password"
        placeholder={t("password")}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
      />
      <Button
        type="submit"
        className="bg-gray-700 w-full py-3 text-lg font-medium"
        loading={loading}
      >
        {loading ? t("logging_in") : t("login")}
      </Button>
    </form>
  );
};

export default LoginForm;
