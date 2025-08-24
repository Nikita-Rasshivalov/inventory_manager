import { useEffect, useState, useCallback } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import { useSelection } from "../../hooks/useSelection";
import { useInventoryActions } from "./hooks/useInventoryActions";
import InventoryTableWrapper from "../../components/InventoryTable/InventoryTableWrapper";
import { InventoryRole } from "../../models/models";
import { useInventoryStore } from "../../stores/useInventoryStore";

const tabs = [InventoryRole.OWNER, InventoryRole.WRITER, InventoryRole.READER];

const InventoryPage = () => {
  const { inventories, page, totalPages, loading, getAll, setPage, setSearch } =
    useInventoryStore();

  const { createInventory, deleteInventories, user } = useInventoryActions();

  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const { selectedIds, toggleSelect, clearSelection } =
    useSelection(inventories);

  const [activeTab, setActiveTab] = useState<InventoryRole>(
    InventoryRole.OWNER
  );

  useEffect(() => {
    getAll(page, sorting.sortBy, sorting.sortOrder);
  }, [page, activeTab, filterText, sorting, getAll]);

  const handleFilterChange = useCallback(
    (text: string) => {
      setFilterText(text);
      setSearch(text);
    },
    [setSearch]
  );

  const handleTabChange = useCallback(
    (tab: InventoryRole) => {
      setActiveTab(tab);
      clearSelection();
      setPage(1);
    },
    [clearSelection, setPage]
  );

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handleDelete = async () => {
    if (!selectedIds.length) return;
    await deleteInventories(selectedIds);
    clearSelection();
  };

  const handleCreate = async (values: Record<string, string>) => {
    const title = values["title"];
    if (!title || !user) return;
    await createInventory(title);
    setIsModalOpen(false);
    getAll();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={inventories.length}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={(tab) => handleTabChange(tab as InventoryRole)}
        filterText={filterText}
        onFilterChange={handleFilterChange}
      />

      <InventoryTableWrapper
        inventories={inventories}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        onSortChange={(sortBy, sortOrder) => setSorting({ sortBy, sortOrder })}
      />

      {isModalOpen && (
        <GenericModal
          title="Create Inventory"
          fields={[{ name: "title", label: "Title" }]}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default InventoryPage;
