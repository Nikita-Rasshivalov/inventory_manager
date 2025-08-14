import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 
        placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition duration-200 ease-in-out
        ${className || ""}`}
    />
  )
);

export default Input;
