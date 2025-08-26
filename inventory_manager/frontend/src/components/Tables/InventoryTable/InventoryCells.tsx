import React from "react";
import { renderCellContent } from "./renderCellContent";

interface InventoryTableRowProps {
  row: any;
  idx: number;
  page: number;
  limit: number;
}

export const InventoryCells: React.FC<InventoryTableRowProps> = ({
  row,
  page,
  limit,
}) => {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer">
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{ width: cell.column.columnDef.size }}
          className="px-4 py-2 text-sm text-gray-700"
        >
          {renderCellContent(cell, row, row.index, {
            page,
            limit,
          })}
        </td>
      ))}
    </tr>
  );
};
