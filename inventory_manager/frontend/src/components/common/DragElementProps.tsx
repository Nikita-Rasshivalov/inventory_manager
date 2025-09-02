import React from "react";
import Button from "./Button";
import { Tooltip } from "@mui/material";
import { Trash2 } from "lucide-react";

interface DragElementProps {
  item: any;
  provided: any;
  onRemove: () => void;
  isCustom?: boolean;
}

const DragElement: React.FC<DragElementProps> = ({
  item,
  provided,
  onRemove,
  isCustom,
}) => {
  return (
    <div
      className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="flex items-center space-x-4">
        <Tooltip title={item.tooltip} placement="top">
          <span className="text-lg">
            {item.label}
            {item.type && item.name ? `: ${item.name}` : ""}
            {item.type === "fixedText" && item.name ? `: ${item.name}` : ""}

            {isCustom && item.name ? `${item.name}` : ""}
            {isCustom && item.value ? `: ${item.value}` : ""}
          </span>
        </Tooltip>
      </div>
      <div className="space-x-4">
        <Button onClick={onRemove} className="w-11 h-5 text-sm">
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export default DragElement;
