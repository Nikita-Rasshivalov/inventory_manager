import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  active,
  loading,
  disabled,
  className = "",
  ...props
}) => (
  <button
    className={`
      px-4 py-2 rounded font-semibold transition flex items-center justify-center
      ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
      ${
        active
          ? "bg-gray-800 text-white"
          : "bg-gray-400 text-white hover:bg-gray-800"
      }
      ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <span className="loader mr-2"></span> : null}
    {children}
  </button>
);

export default Button;
