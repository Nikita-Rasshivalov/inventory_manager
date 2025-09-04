import React from "react";
import GenericModal from "../../components/layout/Modal";
import ItemTable from "../../components/Tables/ItemTable/ItemTable";
import { Item } from "../../models/models";

interface ItemsViewProps {
  items: Item[];
  selectedIds: number[];
  toggleSelect: (id: number) => void;
  page: number;
  limit: number;
  totalPages: number;
  setPage: (p: number) => void;
  loading: boolean;
  setSorting: (sorting: any) => void;
  isModalOpen: boolean;
  onCreate: (values: Record<string, any>) => void;
  onCloseModal: () => void;
  showCheckboxes: boolean;
}

export const ItemsView: React.FC<ItemsViewProps> = ({
  items,
  selectedIds,
  toggleSelect,
  page,
  limit,
  totalPages,
  setPage,
  loading,
  setSorting,
  isModalOpen,
  onCreate,
  onCloseModal,
  showCheckboxes,
}) => (
  <>
    <ItemTable
      items={items}
      selectedIds={selectedIds}
      toggleSelect={toggleSelect}
      page={page}
      limit={limit}
      totalPages={totalPages}
      onPageChange={setPage}
      loading={loading}
      setSorting={setSorting}
      showCheckboxes={showCheckboxes}
    />
    {isModalOpen && (
      <GenericModal
        title="Create Item"
        fields={[]}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onCreate}
      />
    )}
  </>
);
