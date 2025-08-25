import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  renderHeader?: (table: any) => React.ReactNode;
  renderRow?: (row: any, table: any, idx: number) => React.ReactNode;
}

export const Table = <T,>({
  data,
  columns,
  onSortChange,
  renderHeader,
  renderRow,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
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

  return (
    <table className="min-w-full divide-y divide-gray-200">
      {renderHeader && renderHeader(table)}
      {renderRow &&
        table.getRowModel().rows.map((row, idx) => renderRow(row, table, idx))}
    </table>
  );
};
