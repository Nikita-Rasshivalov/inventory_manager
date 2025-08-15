import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { isValidEmail } from "../utils/validators";
import Socials from "../components/common/Socials";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError(
        "Email must contain '@' and a domain with a dot, e.g. user@example.com"
      );
      return;
    }
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Create a New Account
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="submit" className="w-full py-3 text-lg font-medium">
            Register
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">Or sign up with</p>
          <Socials />
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
