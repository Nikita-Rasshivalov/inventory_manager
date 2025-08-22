import { useState, useEffect } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import { useSelection } from "../../hooks/useSelection";
import { useInventoryActions } from "./hooks/useInventoryActions";
import { useInventoryFilter } from "./hooks/useInventoryFilter";
import { InventoryRole } from "../../models/models";
import InventoryTable from "../../components/InventoryTable/InventoryTable";

const tabs = [InventoryRole.OWNER, InventoryRole.WRITER, InventoryRole.READER];

const InventoryPage = () => {
  const {
    inventories,
    loadInventories,
    createInventory,
    deleteInventories,
    user,
  } = useInventoryActions();

  const [activeTab, setActiveTab] = useState(InventoryRole.OWNER);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const filteredInventories = useInventoryFilter(
    inventories,
    activeTab,
    user
  ).filter((inv) => inv.title.toLowerCase().includes(filterText.toLowerCase()));

  const { selectedIds, toggleSelect, clearSelection } =
    useSelection(filteredInventories);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

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
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        User Dashboard
      </h1>

      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={filteredInventories.length}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab as InventoryRole);
          clearSelection();
        }}
        filterText={filterText}
        onFilterChange={setFilterText}
      />

      <InventoryTable
        inventories={filteredInventories}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
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
    </main>
  );
};

export default InventoryPage;
