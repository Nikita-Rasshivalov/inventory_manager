import { useEffect, useState, useCallback } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import ItemTable from "../../components/Tables/ItemTable/ItemTable";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { useSelection } from "../../hooks/useSelection";
import { AccessTab } from "./AccessTab/AccessTab";
import { InventoryMember } from "../../models/models";

const TABS = [
  { id: "Items", label: "Items" },
  { id: "Access", label: "Access" },
];

type TabId = (typeof TABS)[number]["id"];

const ItemPage = ({ inventoryId }: { inventoryId: number }) => {
  const { getById } = useInventoryStore();
  const {
    items,
    page,
    totalPages,
    limit,
    getAll,
    setPage,
    create,
    update,
    delete: deleteItem,
    loading,
  } = useItemStore();

  const { selectedIds, toggleSelect, clearSelection } = useSelection(items);
  const [filterText, setFilterText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("Items");
  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});
  const [inventoryMembers, setInventoryMembers] = useState<InventoryMember[]>(
    []
  );

  const loadItems = useCallback(() => {
    getAll(inventoryId, page, sorting.sortBy, sorting.sortOrder);
  }, [inventoryId, page, sorting, getAll]);

  const reloadMembers = useCallback(async () => {
    const inventory = await getById(inventoryId);
    setInventoryMembers(inventory.members);
  }, [inventoryId, getById]);

  useEffect(() => {
    switch (activeTab) {
      case "Items":
        loadItems();
        setFilterText("");
        break;
      case "Access":
        reloadMembers();
        setFilterText("");
        break;
      default:
        break;
    }
  }, [activeTab, loadItems, reloadMembers]);

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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={items.length}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={TABS.map((t) => t.label)}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab as TabId)}
        filterText={filterText}
        onFilterChange={(text) => setFilterText(text)}
      />

      {activeTab === "Items" && (
        <>
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
              fields={[]} // позже сюда динамически передадим поля
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreate}
            />
          )}
        </>
      )}
      {activeTab === "Access" && (
        <AccessTab
          inventoryId={inventoryId}
          members={inventoryMembers}
          reloadMembers={reloadMembers}
          search={filterText}
        />
      )}
    </div>
  );
};

export default ItemPage;
