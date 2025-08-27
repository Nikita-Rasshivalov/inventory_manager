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
  limit?: number;
}

export const Table = <T,>({
  data,
  columns,
  onSortChange,
  renderHeader,
  renderRow,
  limit,
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

  const rows = table.getRowModel().rows;

  if (rows.length === 0) {
    return <div className="w-full text-center py-6 text-gray-500">No data</div>;
  }

  const emptyRowsCount = limit ? limit - rows.length : 0;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      {renderHeader && renderHeader(table)}
      <tbody className="divide-y divide-gray-200 bg-white">
        {renderRow && rows.map((row, idx) => renderRow(row, table, idx))}
      </tbody>

      {emptyRowsCount > 0 && (
        <tbody>
          {Array.from({ length: emptyRowsCount }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="h-9">
              <td colSpan={columns.length}></td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
};
