import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isNullOrEmpty, isValidEmail } from "../../utils/validators";
import Button from "../common/Button";
import Input from "../common/Input";
import { useTranslation } from "react-i18next";

interface RegisterFormProps {
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onError,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    setLoading(true);

    if (isNullOrEmpty(name)) {
      onError(t("fill_name"));
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      onError(t("invalid_email"));
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
    } catch (err: any) {
      onError(
        err.response?.data?.error || err.message || t("registration_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        placeholder={t("name")}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
      />
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
        {loading ? t("registering") : t("register")}
      </Button>
    </form>
  );
};

export default RegisterForm;
