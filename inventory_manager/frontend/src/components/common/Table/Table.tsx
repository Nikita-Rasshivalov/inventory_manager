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
  initialSorting?: SortingState;
}

export const Table = <T,>({
  data,
  columns,
  onSortChange,
  renderHeader,
  renderRow,
  limit,
  initialSorting,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>(initialSorting || []);

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
    return (
      <div className="w-full text-center py-6 text-gray-500 dark:text-gray-400">
        No data
      </div>
    );
  }

  const emptyRowsCount = limit ? limit - rows.length : 0;

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      {renderHeader && renderHeader(table)}
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 transition-colors duration-300">
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
