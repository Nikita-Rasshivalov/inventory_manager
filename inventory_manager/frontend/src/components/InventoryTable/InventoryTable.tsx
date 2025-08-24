import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Inventory } from "../../models/models";
import { getInventoryColumns } from "./columns";
import InventoryTableHeader from "./InventoryTableHeader";
import InventoryTableRow from "./InventoryTableRow";

interface InventoryTableProps {
  inventories: Inventory[];
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventories,
  selectedIds,
  toggleSelect,
  onSortChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => getInventoryColumns(inventories, selectedIds, toggleSelect),
    [inventories, selectedIds, toggleSelect]
  );

  const table = useReactTable({
    data: inventories,
    columns,
    state: { sorting },
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      setSorting(newSorting);

      const sort = newSorting?.[0];
      if (sort && onSortChange) {
        onSortChange(sort.id, sort.desc ? "desc" : "asc");
      }
    },
    getCoreRowModel: getCoreRowModel(),
  });

  if (!inventories.length)
    return (
      <div className="p-4 text-gray-500 text-center">No inventories found.</div>
    );

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <InventoryTableHeader headerGroups={table.getHeaderGroups()} />
        <InventoryTableRow rows={table.getRowModel().rows} />
      </table>
    </div>
  );
};

export default InventoryTable;
