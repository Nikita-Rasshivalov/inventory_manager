import React from "react";
import { renderCellContent } from "./renderCellContent";

interface ItemCellsProps {
  row: any;
  isExpanded: boolean;
  isEditing: boolean;
  fieldDrafts: Record<number, any>;
  setFieldDrafts: (drafts: Record<number, any>) => void;
  startEdit: () => void;
  save: () => void;
  toggleExpanded: () => void;
  page: number;
  limit: number;
}

export const ItemCells: React.FC<ItemCellsProps> = ({
  row,
  isExpanded,
  isEditing,
  fieldDrafts,
  setFieldDrafts,
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
            fieldDrafts,
            setFieldDrafts,
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
