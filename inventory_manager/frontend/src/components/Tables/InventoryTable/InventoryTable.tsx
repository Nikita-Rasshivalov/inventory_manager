import React from "react";
import { Inventory } from "../../../models/models";
import { TableWrapper } from "../../common/Table/TableWrapper";
import { Table } from "../../common/Table/Table";
import { getInventoryColumns } from "./columns";
import TableHeader from "../../common/Table/TableHeader";
import InventoryTableRow from "./InventoryTableRow";
import { useTranslation } from "react-i18next";

interface InventoryTableProps {
  inventories: Inventory[];
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
  showCheckboxes: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventories,
  selectedIds,
  toggleSelect,
  page,
  limit,
  totalPages,
  onPageChange,
  loading,
  setSorting,
  showCheckboxes,
}) => {
  const { t } = useTranslation();
  return (
    <TableWrapper
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      loading={loading}
    >
      <Table
        data={inventories}
        initialSorting={[{ id: "created", desc: true }]}
        columns={getInventoryColumns(
          inventories,
          selectedIds,
          toggleSelect,
          showCheckboxes,
          t
        )}
        onSortChange={(sortBy, sortOrder) => setSorting({ sortBy, sortOrder })}
        renderHeader={(table) => (
          <TableHeader headerGroups={table.getHeaderGroups()} />
        )}
        renderRow={(row, idx) => (
          <InventoryTableRow
            key={row.id ?? idx}
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

export default InventoryTable;
