import { forwardRef, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options?: { label: string; value: string }[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={`w-full border border-gray-300 rounded-md 
        px-2 py-1 text-xs text-gray-700
        bg-gray-200 placeholder-gray-400
        focus:outline-none focus:ring-1 focus:border-gray-400
        transition duration-200 ease-in-out
        ${className || ""}`}
    >
      {options.length > 0
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  )
);

export default Select;
