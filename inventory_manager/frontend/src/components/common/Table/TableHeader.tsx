import React from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableHeaderProps {
  headerGroups: any[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups }) => (
  <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
    {headerGroups.map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header: any) => (
          <th
            key={header.id}
            style={{
              width: header.column.columnDef.size ?? "auto",
              maxWidth: header.column.columnDef.maxSize ?? "300px",
              minWidth: header.column.columnDef.minSize ?? "50px",
            }}
            className={`px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 select-none ${
              header.id !== "select" ? "cursor-pointer" : ""
            }`}
            onClick={
              header.id !== "select"
                ? header.column.getToggleSortingHandler?.()
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.id !== "select" &&
                (header.column.getIsSorted() === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                ) : header.column.getIsSorted() === "desc" ? (
                  <ChevronDown className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                ) : (
                  <div className="w-3 h-3" />
                ))}
            </div>
          </th>
        ))}
      </tr>
    ))}
  </thead>
);

export default TableHeader;
