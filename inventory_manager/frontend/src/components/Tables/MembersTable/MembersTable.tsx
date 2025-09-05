import React from "react";
import { flexRender } from "@tanstack/react-table";
import { InventoryMember } from "../../../models/models";
import TableHeader from "../../common/Table/TableHeader";
import { Table } from "../../common/Table/Table";
import { getMemberColumns } from "./columns";

interface MembersTableProps {
  inventoryId: number;
  members: InventoryMember[];
  selectedIds: number[];
  toggleSelect: (userId: number) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  inventoryId,
  members,
  selectedIds,
  toggleSelect,
}) => {
  const columns = getMemberColumns(
    inventoryId,
    selectedIds,
    toggleSelect,
    members
  );

  return (
    <div className="border border-gray-200 rounded bg-white dark:bg-gray-800 w-full overflow-auto">
      <Table
        data={members}
        columns={columns}
        renderHeader={(table) => (
          <TableHeader headerGroups={table.getHeaderGroups()} />
        )}
        renderRow={(row) => (
          <tr
            key={row.id}
            className="border-b last:border-b-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        )}
      />
    </div>
  );
};
