import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";
import Button from "../common/Button";
import Input from "../common/Input";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError("");
    setLoading(true);

    if (!isValidEmail(email)) {
      onError("Email must contain '@' and a domain like user@example.com");
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
    } catch (err: any) {
      onError(
        err.response?.data?.error || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
      />
      <Input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
      />
      <Input
        type="password"
        placeholder="Password"
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
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
