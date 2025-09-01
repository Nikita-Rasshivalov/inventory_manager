import React from "react";
import { useNavigate } from "react-router-dom";
import { ItemCells } from "./ItemCells";

interface ItemTableRowProps {
  rows: any[];
  page: number;
  limit: number;
}

const ItemTableRow: React.FC<ItemTableRowProps> = ({ rows, page, limit }) => {
  const navigate = useNavigate();

  const handleRowClick = (itemId: number, inventoryId: number) => {
    navigate(`/inventory/${inventoryId}/items/${itemId}`);
  };

  return (
    <>
      {rows.map((row, idx) => (
        <tr
          key={row.original?.id ?? idx}
          className="hover:bg-gray-50 cursor-pointer"
          onClick={() =>
            handleRowClick(row.original.id, row.original.inventoryId)
          }
        >
          <ItemCells row={row} page={page} limit={limit} />
        </tr>
      ))}
    </>
  );
};

export default ItemTableRow;
