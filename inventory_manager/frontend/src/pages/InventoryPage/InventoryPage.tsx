import { useEffect, useCallback, useState } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import { useSelection } from "../../hooks/useSelection";
import { useInventoryActions } from "./hooks/useInventoryActions";
import { InventoryRole } from "../../models/models";
import { useInventoryStore } from "../../stores/useInventoryStore";
import InventoryTable from "../../components/InventoryTable/InventoryTable";

const tabs: InventoryRole[] = [
  InventoryRole.OWNER,
  InventoryRole.WRITER,
  InventoryRole.READER,
];

const InventoryPage = () => {
  const { createInventory, deleteInventories, user } = useInventoryActions();

  const {
    inventories,
    page,
    totalPages,
    loading,
    getAll,
    setPage,
    setSearch,
    search,
    activeTab,
    setActiveTab,
  } = useInventoryStore();

  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedIds, toggleSelect, clearSelection } =
    useSelection(inventories);

  useEffect(() => {
    getAll(page, sorting.sortBy, sorting.sortOrder, activeTab, search);
  }, [page, sorting, activeTab, search, getAll]);

  const handleFilterChange = useCallback(
    (text: string) => setSearch(text),
    [setSearch]
  );

  const handleTabChange = useCallback(
    (tab: InventoryRole) => {
      setActiveTab(tab);
      clearSelection();
      setPage(1);
    },
    [setActiveTab, clearSelection, setPage]
  );

  const handlePageChange = (p: number) => setPage(p);

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
        filterText={search}
        onFilterChange={handleFilterChange}
      />

      <InventoryTable
        inventories={inventories}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        setSorting={setSorting}
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
