import React from "react";
import { flexRender } from "@tanstack/react-table";
import { InventoryMember } from "../../../models/models";
import TableHeader from "../../common/Table/TableHeader";
import { Table } from "../../common/Table/Table";

interface MembersTableProps {
  members: InventoryMember[];
}

export const MembersTable: React.FC<MembersTableProps> = ({ members }) => {
  const columns = [
    {
      header: "#",
      accessorFn: (_row: InventoryMember, idx: number) => idx + 1,
      id: "index",
      size: 30,
    },
    {
      header: "Name",
      accessorFn: (row: InventoryMember) => row.user?.name ?? "-",
      id: "name",
      size: 150,
    },
    {
      header: "Mail",
      accessorFn: (row: InventoryMember) => row.user?.email ?? "-",
      id: "email",
      size: 200,
    },
    {
      header: "Role",
      accessorFn: (row: InventoryMember) => row.role,
      id: "role",
      size: 100,
    },
  ];

  return (
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
  );
};
