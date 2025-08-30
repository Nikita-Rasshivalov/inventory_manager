import React from "react";
import Button from "../../../components/common/Button";
import { Tooltip } from "@mui/material";

interface IdElementProps {
  item: any;
  provided: any;
  onRemove: () => void;
}

const IdElement: React.FC<IdElementProps> = ({ item, provided, onRemove }) => {
  return (
    <div
      className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="flex items-center space-x-4">
        <Tooltip title={item.tooltip} placement="top">
          <span className="text-lg">{item.label}</span>
        </Tooltip>
      </div>
      <div className="space-x-4">
        <Button onClick={onRemove} className="w-15 h-5 text-sm">
          Remove
        </Button>
      </div>
    </div>
  );
};

export default IdElement;
