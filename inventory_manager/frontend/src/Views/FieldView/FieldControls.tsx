import React, { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import SelectWithTooltip from "../../components/common/SelectWithTooltip";
import { fieldOptions } from "./fieldOptions";
import { Save } from "lucide-react";

interface FieldControlsProps {
  newType: string;
  setNewType: (type: string) => void;
  name: string;
  setName: (name: string) => void;
  onAdd: () => Promise<void> | void;
}

export const FieldControls: React.FC<FieldControlsProps> = ({
  newType,
  setNewType,
  name,
  setName,
  onAdd,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await onAdd();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center md:w-7/10 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-200">
      <SelectWithTooltip
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        options={fieldOptions}
      />
      <Input
        type="text"
        value={name}
        placeholder="Field name"
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-2 py-2 text-sm min-[425px]:h-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-200"
      />
      <Button
        onClick={handleAdd}
        disabled={isSaving}
        className="w-full min-[425px]:h-8 disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white dark:text-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Save size={16} />
        Add Field
      </Button>
    </div>
  );
};
