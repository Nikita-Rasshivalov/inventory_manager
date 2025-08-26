import React, { useState, useEffect } from "react";

interface ItemFieldCellProps {
  value: string | number | boolean | null;
  isEditing: boolean;
  onChange: (v: string) => void;
}

export const ItemFieldCell: React.FC<ItemFieldCellProps> = ({
  value,
  isEditing,
  onChange,
}) => {
  const [draft, setDraft] = useState(value?.toString() ?? "");

  useEffect(() => {
    setDraft(value?.toString() ?? "");
  }, [value]);

  if (!isEditing) return <span>{value?.toString() ?? ""}</span>;

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onChange(draft)}
      className="border rounded px-2 py-1 w-full"
    />
  );
};
