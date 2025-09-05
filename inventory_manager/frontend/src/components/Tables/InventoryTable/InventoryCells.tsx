import React from "react";
import { renderCellContent } from "./renderCellContent";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const handleRowClick = () => {
    navigate(`/inventory/${row.original.id}/items`, {
      state: {
        inventoryTitle: row.original.title,
      },
    });
  };
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-blue-700 cursor-pointer h-9 transition-colors duration-200">
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{ width: cell.column.columnDef.size }}
          className="px-4 py-0 text-sm text-gray-700 dark:text-blue-200"
          onClick={handleRowClick}
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
