import React from "react";
import { renderCellContent } from "./renderCellContent";

interface InventoryTableRowProps {
  row: any;
  idx: number;
  isExpanded: boolean;
  isEditing: boolean;
  titleDraft: string;
  setTitleDraft: (value: string) => void;
  startEdit: (id: number, current: string) => void;
  save: (row: any) => void;
  toggleExpanded: () => void;
  page: number;
  limit: number;
}

export const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  row,
  isExpanded,
  isEditing,
  titleDraft,
  setTitleDraft,
  startEdit,
  save,
  toggleExpanded,
  page,
  limit,
}) => {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={toggleExpanded}>
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{ width: cell.column.columnDef.size }}
          className="px-4 py-2 text-sm text-gray-700"
        >
          {renderCellContent(cell, row, row.index, {
            isEditing,
            isExpanded,
            titleDraft,
            setTitleDraft,
            save,
            startEdit,
            page,
            limit,
          })}
        </td>
      ))}
    </tr>
  );
};
