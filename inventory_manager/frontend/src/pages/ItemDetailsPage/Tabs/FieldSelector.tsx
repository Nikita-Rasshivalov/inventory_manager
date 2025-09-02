import React from "react";
import Select from "../../../components/common/Select";

interface FieldSelectorProps {
  fields: { id: number; name: string }[];
  selectedFieldId: number | null;
  setSelectedFieldId: (id: number) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  selectedFieldId,
  setSelectedFieldId,
}) => (
  <Select
    value={selectedFieldId?.toString() ?? ""}
    onChange={(e) => setSelectedFieldId(Number(e.target.value))}
    className="w-full min-[425px]:h-8"
  >
    <option value="" disabled>
      Select field
    </option>
    {fields.map((f) => (
      <option key={f.id} value={f.id.toString()}>
        {f.name}
      </option>
    ))}
  </Select>
);

export default FieldSelector;
