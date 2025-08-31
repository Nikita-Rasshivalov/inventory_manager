import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { generateLiveExample } from "../../../utils/customIdUtils";
import { elementOptions } from "./elementOptions";
import SelectWithTooltip from "./SelectWithTooltip";

interface CustomIdControlsProps {
  newElementType: string;
  setNewElementType: (v: string) => void;
  fixedTextValue: string;
  setFixedTextValue: (v: string) => void;
  idElements: any[];
  setIdElements: (elements: any[]) => void;
  liveExample: string;
  onSave: () => void;
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
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium">Live Example:</h3>
        <div className="text-xl text-gray-700">{liveExample}</div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
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
            className="border rounded px-2 py-1 text-sm w-35 min-[425px]:w-64"
          />
        )}
        <Button
          onClick={handleAddElement}
          className="text-[10px] min-[425px]:w-64 min-[425px]:h-8 sm:text-sm w-35 h-6"
        >
          Add Element
        </Button>

        <Button
          onClick={onSave}
          className="text-[10px] min-[425px]:w-64 min-[425px]:h-8 sm:text-sm w-35 h-6"
        >
          Save Template
        </Button>
      </div>
    </div>
  );
};
