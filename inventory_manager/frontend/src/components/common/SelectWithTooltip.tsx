import React from "react";
import Select from "./Select";
import { useTranslation } from "react-i18next";

interface ElementOption {
  label: string;
  type: string;
  tooltip?: string;
}

interface SelectWithTooltipProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ElementOption[];
}

const SelectWithTooltip: React.FC<SelectWithTooltipProps> = ({
  value,
  onChange,
  options,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        className="w-full  min-[425px]:h-8"
      >
        <option value="">{t("select_element")}</option>
        {options.map((option) => (
          <option key={option.type} value={option.type}>
            {option.label}
          </option>
        ))}
      </Select>
    </>
  );
};

export default SelectWithTooltip;
