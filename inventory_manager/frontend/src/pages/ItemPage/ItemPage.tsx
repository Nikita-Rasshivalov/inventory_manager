import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Toolbar from "../../components/layout/Toolbar";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { useSelection } from "../../hooks/useSelection";
import { MemberAction } from "../../models/models";
import { AccessView } from "../Views/AccessView/AccessView";
import { ItemsView } from "../Views/ItemsView/ItemsView";

enum TabId {
  Items = "Items",
  Access = "Access",
}

const TABS: TabId[] = [TabId.Items, TabId.Access];

const ItemPage = ({ inventoryId }: { inventoryId: number }) => {
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

  const { inventoryMembers, updateMembers, getById } = useInventoryStore();

  const itemsSelection = useSelection(items);
  const membersSelection = useSelection(inventoryMembers);

  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Items);
  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});

  const loadItems = useCallback(
    () => getAll(inventoryId, page, sorting.sortBy, sorting.sortOrder),
    [inventoryId, page, sorting, getAll]
  );

  useEffect(() => {
    if (activeTab === TabId.Items) {
      loadItems();
    }
    if (activeTab === TabId.Access) {
      getById(inventoryId);
    }
    setFilterText("");
  }, [activeTab, loadItems, getById, inventoryId]);

  const handleDelete = async () => {
    try {
      if (activeTab === TabId.Items) {
        for (const id of itemsSelection.selectedIds) {
          await deleteItem(inventoryId, id);
        }
        itemsSelection.clearSelection();
      }
      if (activeTab === TabId.Access) {
        const updates = membersSelection.selectedIds.map((userId) => ({
          userId,
          action: MemberAction.Remove,
        }));
        await updateMembers(inventoryId, updates);
        membersSelection.clearSelection();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleCreate = async (values: Record<string, any>) => {
    try {
      await create(inventoryId, {
        fieldValues: Object.entries(values).map(([fieldId, value]) => ({
          fieldId: Number(fieldId),
          value,
        })),
      });
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create item");
    }
  };

  const handleUpdate = async (itemId: number, values: Record<string, any>) => {
    try {
      await update(inventoryId, itemId, {
        fieldValues: Object.entries(values).map(([fieldId, value]) => ({
          fieldId: Number(fieldId),
          value,
        })),
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update item");
    }
  };

  const selectedCount =
    activeTab === TabId.Items
      ? itemsSelection.selectedIds.length
      : membersSelection.selectedIds.length;

  const totalCount =
    activeTab === TabId.Items ? items.length : inventoryMembers.length;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <Toolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        onDelete={handleDelete}
        onCreate={
          activeTab === TabId.Items ? () => setIsModalOpen(true) : undefined
        }
        tabs={TABS}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab as TabId)}
        filterText={filterText}
        onFilterChange={setFilterText}
      />

      {activeTab === TabId.Items && (
        <ItemsView
          items={items}
          selectedIds={itemsSelection.selectedIds}
          toggleSelect={itemsSelection.toggleSelect}
          page={page}
          limit={limit}
          totalPages={totalPages}
          setPage={setPage}
          loading={loading}
          setSorting={setSorting}
          onUpdate={handleUpdate}
          isModalOpen={isModalOpen}
          onCreate={handleCreate}
          onCloseModal={() => setIsModalOpen(false)}
        />
      )}

      {activeTab === TabId.Access && (
        <AccessView
          inventoryId={inventoryId}
          members={inventoryMembers}
          search={filterText}
          updateMembers={updateMembers}
          selectedIds={membersSelection.selectedIds}
          toggleSelect={membersSelection.toggleSelect}
        />
      )}
    </div>
  );
};

export default ItemPage;
