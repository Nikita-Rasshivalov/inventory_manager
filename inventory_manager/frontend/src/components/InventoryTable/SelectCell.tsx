import React from "react";

interface SelectCellProps {
  checked: boolean;
  count?: number;
  onChange: () => void;
}

const SelectCell: React.FC<SelectCellProps> = ({
  checked,
  count,
  onChange,
}) => (
  <div className="flex items-center justify-center gap-3">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="text-sm text-gray-700 inline-block text-center w-5">
      {count && count > 0 ? count : "\u00A0"}
    </span>
  </div>
);

export default SelectCell;
