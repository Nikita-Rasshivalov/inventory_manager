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
    <>
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
    </>
  );
};

export default InventoryTableRow;
