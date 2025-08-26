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
      />
    ),
    size: 50,
    enableSorting: false,
  },
  {
    id: "number",
    header: "#",
    size: 30,
    enableSorting: false,
  },
  {
    accessorKey: "customId",
    header: "Custom ID",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.createdBy?.name,
    id: "createdBy",
    header: "Created By",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.fieldValues.map((fv) => `${fv.value}`).join(", "),
    id: "fields",
    header: "Fields",
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.comments.length,
    id: "comments",
    header: "Comments",
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.likes.length,
    id: "likes",
    header: "Likes",
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
