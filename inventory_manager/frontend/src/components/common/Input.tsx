import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      {...props}
      className={`
        border border-gray-300 rounded-md 
        px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-700 
        placeholder-gray-400 
        focus:outline-none focus:ring-1 focus:border-gray-400
        transition duration-200 ease-in-out bg-gray-200
        ${type !== "checkbox" && type !== "radio" ? "w-full" : ""}
        ${className || ""}
      `}
    />
  )
);

export default Input;
