import React from "react";
import Select from "../../../components/common/Select";

interface Option {
  label: string;
  value: string;
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
      <Select value={value} onChange={onChange}>
        <option value="">Select an element</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelectWithTooltip;
