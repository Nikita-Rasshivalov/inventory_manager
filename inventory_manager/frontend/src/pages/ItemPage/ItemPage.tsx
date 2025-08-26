import { useEffect, useState, useCallback } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import { useSelection } from "../../hooks/useSelection";
import { useItemStore } from "../../stores/useItemStore";
import ItemTable from "../../components/Tables/ItemTable/ItemTable";

const ItemPage = ({ inventoryId }: { inventoryId: number }) => {
  const {
    items,
    page,
    totalPages,
    loading,
    getAll,
    setPage,
    limit,
    create,
    update,
    delete: deleteItem,
  } = useItemStore();

  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedIds, toggleSelect, clearSelection } = useSelection(items);

  const loadItems = useCallback(() => {
    getAll(inventoryId, page, sorting.sortBy, sorting.sortOrder);
  }, [inventoryId, page, sorting, getAll]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handlePageChange = (p: number) => setPage(p);

  const handleDelete = async () => {
    if (!selectedIds.length) return;
    for (const id of selectedIds) {
      await deleteItem(inventoryId, id);
    }
    clearSelection();
  };

  const handleCreate = async (values: Record<string, any>) => {
    await create(inventoryId, {
      fieldValues: Object.entries(values).map(([fieldId, value]) => ({
        fieldId: Number(fieldId),
        value,
      })),
    });
    setIsModalOpen(false);
  };

  const handleUpdate = async (itemId: number, values: Record<string, any>) => {
    await update(inventoryId, itemId, {
      fieldValues: Object.entries(values).map(([fieldId, value]) => ({
        fieldId: Number(fieldId),
        value,
      })),
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={items.length}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        filterText=""
        onFilterChange={() => {}}
      />

      <ItemTable
        items={items}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        setSorting={setSorting}
        onUpdate={handleUpdate}
      />

      {isModalOpen && (
        <GenericModal
          title="Create Item"
          fields={[]} // сюда позже передадим поля инвентаря
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default ItemPage;
