import React from "react";
import Select from "../../../components/common/Select";

interface Option {
  label: string;
  type: string;
  tooltip: string;
}

interface SelectWithTooltipProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

const SelectWithTooltip: React.FC<SelectWithTooltipProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <Select
        value={value}
        onChange={onChange}
        className="min-[425px]:w-64 min-[425px]:h-8"
      >
        <option value="">Select an element</option>
        {options.map((option) => (
          <option key={option.type} value={option.type}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelectWithTooltip;
