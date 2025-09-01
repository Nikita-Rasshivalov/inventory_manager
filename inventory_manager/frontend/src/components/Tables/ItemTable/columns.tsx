import { ColumnDef } from "@tanstack/react-table";
import { Item } from "../../../models/models";
import SelectedColumns from "../../common/Table/SelectedColumns";

export const getItemColumns = (
  items: Item[],
  selectedIds: number[],
  toggleSelect: (id: number) => void
): ColumnDef<Item>[] => [
  {
    id: "select",
    header: () => {
      const pageIds = items.map((item) => item.id);
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
    size: 10,
    enableSorting: false,
  },
  {
    id: "number",
    header: "#",
    size: 50,
    enableSorting: false,
  },
  {
    accessorKey: "customId",
    header: "Custom ID",
    enableSorting: true,
    size: 250,
  },
  {
    accessorFn: (row) => row.createdBy?.name,
    id: "createdBy",
    header: "Created By",
    enableSorting: true,
    size: 250,
  },
  {
    accessorFn: (row) => new Date(row.createdAt),
    id: "created",
    header: "Created",
    enableSorting: true,
    cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
    size: 250,
  },
];
