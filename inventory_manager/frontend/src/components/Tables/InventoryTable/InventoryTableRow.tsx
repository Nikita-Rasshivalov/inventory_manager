import React from "react";
import { InventoryCells } from "./InventoryCells";

interface InventoryTableRowProps {
  rows: any[];
  page: number;
  limit: number;
}

const InventoryTableRowWrapper: React.FC<InventoryTableRowProps> = ({
  rows,
  page,
  limit,
}) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {rows.map((row, idx) => {
        return <InventoryCells row={row} idx={idx} page={page} limit={limit} />;
      })}
    </tbody>
  );
};

export default InventoryTableRowWrapper;
