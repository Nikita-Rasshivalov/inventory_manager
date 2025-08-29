import { ColumnDef } from "@tanstack/react-table";
import { InventoryMember } from "../../../models/models";

export const getMemberColumns = (): ColumnDef<InventoryMember>[] => [
  {
    id: "number",
    header: "#",
    size: 30,
    enableSorting: false,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorFn: (row) => row.user?.name,
    id: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.user?.email,
    id: "mail",
    header: "Mail",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.role,
    id: "role",
    header: "Role",
    enableSorting: true,
  },
];
