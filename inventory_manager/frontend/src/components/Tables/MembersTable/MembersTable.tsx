import React from "react";
import { flexRender } from "@tanstack/react-table";
import { InventoryMember } from "../../../models/models";
import TableHeader from "../../common/Table/TableHeader";
import { Table } from "../../common/Table/Table";
import { getMemberColumns } from "./columns";

interface MembersTableProps {
  members: InventoryMember[];
  selectedIds: number[];
  toggleSelect: (userId: number) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  selectedIds,
  toggleSelect,
}) => {
  const columns = getMemberColumns(members, selectedIds, toggleSelect);

  return (
    <div className="border border-gray-200 rounded bg-white w-full overflow-auto">
      <Table
        data={members}
        columns={columns}
        renderHeader={(table) => (
          <TableHeader headerGroups={table.getHeaderGroups()} />
        )}
        renderRow={(row) => (
          <tr key={row.id} className="border-b last:border-b-0">
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
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
