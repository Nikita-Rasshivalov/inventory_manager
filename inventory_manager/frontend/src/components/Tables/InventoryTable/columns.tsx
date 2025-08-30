import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "../../../models/models";
import SelectedColumns from "../../common/Table/SelectedColumns";

export const getInventoryColumns = (
  inventories: Inventory[],
  selectedIds: number[],
  toggleSelect: (id: number) => void
): ColumnDef<Inventory>[] => [
  {
    id: "select",
    header: () => {
      const pageIds = inventories.map((inv) => inv.id);
      const allSelected =
        pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

      const handleChange = () => {
        if (allSelected) {
          pageIds.forEach((id) => toggleSelect(id));
        } else {
          pageIds.forEach((id) => {
            if (!selectedIds.includes(id)) toggleSelect(id);
          });
        }
      };

      return (
        <SelectedColumns
          checked={allSelected}
          count={selectedIds.length}
          onChange={handleChange}
        />
      );
    },
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(row.original.id)}
        onChange={() => toggleSelect(row.original.id)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
  },
  {
    id: "number",
    header: "#",
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
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
    size: 50,
    minSize: 40,
    maxSize: 80,
    enableSorting: false,
  },
  {
    accessorFn: (row) => new Date(row.createdAt),
    id: "created",
    header: "Created",
    enableSorting: true,
    cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
  },
];
