import React from "react";
import { renderCellContent } from "./renderCellContent";

interface ItemCellsProps {
  row: any;
  page: number;
  limit: number;
}

export const ItemCells: React.FC<ItemCellsProps> = ({ row, page, limit }) => {
  return (
    <>
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{ width: cell.column.columnDef.size }}
          className="px-4 py-2 text-sm text-gray-700"
        >
          {renderCellContent(cell, row, row.index, { page, limit })}
        </td>
      ))}
    </>
  );
};
