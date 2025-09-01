import React from "react";
import { Item } from "../../../models/models";
import TableHeader from "../../common/Table/TableHeader";
import { TableWrapper } from "../../common/Table/TableWrapper";
import { getItemColumns } from "./columns";
import ItemTableRow from "./ItemTableRow";
import { Table } from "../../common/Table/Table";

interface ItemTableProps {
  items: Item[];
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  loading: boolean;
  setSorting: (sorting: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  selectedIds,
  toggleSelect,
  page,
  limit,
  totalPages,
  onPageChange,
  loading,
  setSorting,
}) => {
  return (
    <TableWrapper
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      loading={loading}
    >
      <Table
        data={items}
        columns={getItemColumns(items, selectedIds, toggleSelect)}
        onSortChange={(sortBy: any, sortOrder: any) =>
          setSorting({ sortBy, sortOrder })
        }
        renderHeader={(table: { getHeaderGroups: () => any[] }) => (
          <TableHeader headerGroups={table.getHeaderGroups()} />
        )}
        renderRow={(row, idx) => (
          <ItemTableRow
            key={row.original.id ?? idx}
            rows={[row]}
            page={page}
            limit={limit}
          />
        )}
        limit={limit}
      />
    </TableWrapper>
  );
};

export default ItemTable;
