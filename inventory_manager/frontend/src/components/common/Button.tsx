import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  disabled,
  className = "",
  ...props
}) => (
  <button
    className={`
      px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center
      ${disabled || loading ? "cursor-not-allowed" : "hover:bg-blue-700"}
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
