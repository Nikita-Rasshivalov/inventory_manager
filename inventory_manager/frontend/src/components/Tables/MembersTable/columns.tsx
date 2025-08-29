import { ColumnDef } from "@tanstack/react-table";
import { InventoryMember } from "../../../models/models";
import SelectedColumns from "../../common/Table/SelectedColumns";

export const getMemberColumns = (
  members: InventoryMember[],
  selectedIds: number[],
  toggleSelect: (userId: number) => void
): ColumnDef<InventoryMember>[] => [
  {
    id: "select",
    header: () => {
      const memberIds = members.map((m) => m.userId);
      const allSelected =
        memberIds.length > 0 &&
        memberIds.every((id) => selectedIds.includes(id));

      const handleChange = () => {
        if (allSelected) {
          memberIds.forEach((id) => toggleSelect(id));
        } else {
          memberIds.forEach((id) => {
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
        checked={selectedIds.includes(row.original.userId)}
        onChange={() => toggleSelect(row.original.userId)}
      />
    ),
    size: 40,
    minSize: 40,
    maxSize: 40,
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.user?.name,
    id: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.user?.email,
    id: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.role,
    id: "role",
    header: "Role",
    enableSorting: true,
  },
];
