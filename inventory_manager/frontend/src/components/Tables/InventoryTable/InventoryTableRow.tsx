import React from "react";
import { InventoryCells } from "./InventoryCells";

interface InventoryTableRowProps {
  rows: any[];
  page: number;
  limit: number;
}

const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  rows,
  page,
  limit,
}) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {rows.map((row, idx) => {
        return (
          <InventoryCells
            key={row.id ?? idx}
            row={row}
            idx={idx}
            page={page}
            limit={limit}
          />
        );
      })}
    </tbody>
  );
};

export default InventoryTableRow;
