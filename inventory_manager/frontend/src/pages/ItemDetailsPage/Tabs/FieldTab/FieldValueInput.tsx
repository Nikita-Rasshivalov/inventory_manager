import React from "react";
import Input from "../../../../components/common/Input";

interface FieldValueInputProps {
  type: string;
  value: any;
  onChange: (val: any) => void;
}

const FieldValueInput: React.FC<FieldValueInputProps> = ({
  type,
  value,
  onChange,
}) => {
  switch (type) {
    case "singleLineText":
      return (
        <Input
          type="text"
          value={value ?? ""}
          placeholder="Enter text"
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        />
      );
    case "multiLineText":
      return (
        <textarea
          value={value}
          placeholder="Enter text"
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-2 text-sm w-full h-20"
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value}
          placeholder="Enter number"
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        />
      );
    case "file":
      return (
        <Input
          type="file"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        />
      );
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <Input
            type="checkbox"
            checked={value === true || value === "true"}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm">True / False</span>
        </div>
      );
    default:
      return null;
  }
};

export default FieldValueInput;
