import { ColumnDef } from "@tanstack/react-table";
import { Inventory } from "../../../models/models";
import SelectedColumns from "../../common/Table/SelectedColumns";

export const getInventoryColumns = (
  inventories: Inventory[],
  selectedIds: number[],
  toggleSelect: (id: number) => void,
  showCheckboxes: boolean = true,
  t: (key: string) => string
): ColumnDef<Inventory>[] => {
  const columns: ColumnDef<Inventory>[] = [];

  if (showCheckboxes) {
    columns.push({
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
    });
  }

  columns.push(
    {
      id: "number",
      header: "#",
      size: 40,

      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: t("column_title"),
      enableSorting: false,
      size: 40,
      minSize: 40,
      maxSize: 100,
    },
    {
      accessorFn: (row) => row.owner?.name,
      id: "owner",
      header: t("column_owner"),
      size: 70,
      minSize: 40,
      maxSize: 100,
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.members.length,
      id: "members",
      header: t("column_members"),
      size: 90,
      minSize: 40,
      maxSize: 100,
      enableSorting: false,
    },
    {
      accessorFn: (row) => row.description || "-",
      id: "description",
      header: t("description"),
      size: 100,
      minSize: 40,
      maxSize: 200,
      enableSorting: false,
    },
    {
      accessorFn: (row) => (row.category ? row.category.name : "-"),
      id: "category",
      header: t("category"),
      size: 100,
      minSize: 40,
      maxSize: 200,
      enableSorting: true,
    },
    {
      accessorFn: (row) =>
        row.tags && row.tags.length > 0
          ? row.tags.map((t) => t.name).join(", ")
          : "-",
      id: "tags",
      header: t("tags"),
      enableSorting: false,
    },
    {
      accessorFn: (row) => new Date(row.createdAt),
      id: "created",
      header: t("column_created"),
      enableSorting: true,
      cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
    }
  );

  return columns;
};
