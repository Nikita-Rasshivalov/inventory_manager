import { ColumnDef } from "@tanstack/react-table";
import { Item } from "../../../models/models";
import SelectedColumns from "../../common/Table/SelectedColumns";

export const getItemColumns = (
  items: Item[],
  selectedIds: number[],
  toggleSelect: (id: number) => void,
  showCheckboxes: boolean = true,
  t: (key: string) => string
): ColumnDef<Item>[] => {
  const columns: ColumnDef<Item>[] = [];

  if (showCheckboxes) {
    columns.push({
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
      size: 40,
      minSize: 40,
      maxSize: 40,
      enableSorting: false,
    });
  }

  columns.push(
    {
      id: "number",
      header: "#",
      size: 50,
      enableSorting: false,
    },
    {
      accessorKey: "customId",
      header: t("column_customId"),
      enableSorting: true,
      size: 250,
    },
    {
      accessorFn: (row) => row.createdBy?.name,
      id: "createdBy",
      header: t("column_createdBy"),
      enableSorting: false,
      size: 250,
    },
    {
      accessorFn: (row) => new Date(row.createdAt),
      id: "createdAt",
      header: t("column_createdAt"),
      enableSorting: true,
      cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
      size: 250,
    }
  );

  return columns;
};
