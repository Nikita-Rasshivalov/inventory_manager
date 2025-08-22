import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "../../models/models";
import SelectCell from "./SelectCell";

export const getInventoryColumns = (
  inventories: Inventory[],
  selectedIds: number[],
  toggleSelect: (id: number) => void
): ColumnDef<Inventory>[] => [
  {
    id: "select",
    header: () => (
      <SelectCell
        checked={
          selectedIds.length === inventories.length && inventories.length > 0
        }
        count={selectedIds.length}
        onChange={() => {
          if (selectedIds.length !== inventories.length) {
            inventories.forEach((inv) => {
              if (!selectedIds.includes(inv.id)) toggleSelect(inv.id);
            });
          } else {
            selectedIds.forEach((id) => toggleSelect(id));
          }
        }}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(row.original.id)}
        onChange={() => toggleSelect(row.original.id)}
      />
    ),
    size: 50,
  },
  {
    accessorFn: (_, index) => index + 1,
    id: "number",
    header: "#",
    size: 30,
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.owner?.name,
    id: "owner",
    header: "Owner",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.members.length,
    id: "members",
    header: "Members",
    enableSorting: true,
  },
  {
    accessorFn: (row) => new Date(row.createdAt),
    id: "created",
    header: "Created",
    enableSorting: true,
    cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
  },
];
