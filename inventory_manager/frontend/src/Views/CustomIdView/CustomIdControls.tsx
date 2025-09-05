import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { generateLiveExample } from "../../utils/customIdUtils";
import { elementOptions } from "./elementOptions";
import SelectWithTooltip from "../../components/common/SelectWithTooltip";
import { Plus, Save } from "lucide-react";

interface CustomIdControlsProps {
  newElementType: string;
  setNewElementType: (v: string) => void;
  fixedTextValue: string;
  setFixedTextValue: (v: string) => void;
  idElements: any[];
  setIdElements: (elements: any[]) => void;
  liveExample: string;
  onSave: () => Promise<void> | void;
  setLiveExample: (example: string) => void;
}

export const CustomIdControls = ({
  newElementType,
  setNewElementType,
  fixedTextValue,
  setFixedTextValue,
  idElements,
  setIdElements,
  liveExample,
  onSave,
  setLiveExample,
}: CustomIdControlsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAddElement = () => {
    if (!newElementType) return;

    const newElement = {
      type: newElementType,
      value: newElementType === "fixedText" ? fixedTextValue : "",
      label:
        elementOptions.find((opt) => opt.type === newElementType)?.label || "",
      tooltip:
        elementOptions.find((opt) => opt.type === newElementType)?.tooltip ||
        "",
    };

    const updatedElements = [...idElements, newElement];
    setIdElements(updatedElements);
    setLiveExample(generateLiveExample(updatedElements));

    setNewElementType("");
    setFixedTextValue("");
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Live Example:
        </h3>
        <div className="text-xl text-gray-700 dark:text-gray-200">
          {liveExample}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <SelectWithTooltip
          value={newElementType}
          onChange={(e) => setNewElementType(e.target.value)}
          options={elementOptions}
        />

        {newElementType === "fixedText" && (
          <Input
            type="text"
            value={fixedTextValue}
            onChange={(e) => setFixedTextValue(e.target.value)}
            className="border rounded px-2 py-2 text-sm min-[425px]:h-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-200"
          />
        )}

        <div className="flex flex-1 items-center gap-3">
          <Button
            onClick={handleAddElement}
            className="flex-1 items-center justify-center bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white dark:text-gray-100 transition-colors duration-200"
          >
            <Plus size={20} />
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white dark:text-gray-100 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200"
          >
            <Save size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
