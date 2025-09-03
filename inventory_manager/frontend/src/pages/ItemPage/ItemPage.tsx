import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Toolbar from "../../components/layout/Toolbar";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { useSelection } from "../../hooks/useSelection";
import { MemberAction } from "../../models/models";
import { AccessView } from "../../Views/AccessView/AccessView";
import { ItemsView } from "../../Views/ItemsView/ItemsView";
import CustomIdView from "../../Views/CustomIdView/CustomIdView";
import FieldView from "../../Views/FieldView/FieldView";
import { DiscussionView } from "../../Views/DiscussionView/DiscussionView";
import { useAuthStore } from "../../stores/useAuthStore";

enum TabId {
  Items = "Items",
  Access = "Access",
  CustomId = "Settings",
  Fields = "Fields",
  Discussion = "Discussion",
}

const TABS: TabId[] = [
  TabId.Items,
  TabId.Access,
  TabId.CustomId,
  TabId.Fields,
  TabId.Discussion,
];

const ItemPage = ({ inventoryId }: { inventoryId: number }) => {
  const {
    items,
    page,
    totalPages,
    limit,
    getAll,
    setPage,
    create,
    delete: deleteItem,
    loading,
  } = useItemStore();
  const { user } = useAuthStore();
  const { inventoryMembers, updateMembers, getById } = useInventoryStore();

  const itemsSelection = useSelection(items);
  const membersSelection = useSelection(inventoryMembers);

  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>(
    (searchParams.get("tab") as TabId) || TabId.Items
  );

  const [sorting, setSorting] = useState<{
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({});

  const loadItems = useCallback(
    () => getAll(inventoryId, page, sorting.sortBy, sorting.sortOrder),
    [inventoryId, page, sorting, getAll]
  );

  useEffect(() => {
    searchParams.set("tab", activeTab);
    setSearchParams(searchParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  useEffect(() => {
    if (activeTab === TabId.Items) loadItems();
    if (activeTab === TabId.Access) getById(inventoryId);
    setFilterText("");
  }, [activeTab, loadItems, getById, inventoryId]);

  const handleDelete = async () => {
    try {
      if (activeTab === TabId.Items) {
        for (const id of itemsSelection.selectedIds)
          await deleteItem(inventoryId, id);
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

  const handleCreate = async () => {
    try {
      await create(inventoryId);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create item");
    }
  };

  const selectedCount =
    activeTab === TabId.Items
      ? itemsSelection.selectedIds.length
      : membersSelection.selectedIds.length;
  const totalCount =
    activeTab === TabId.Items ? items.length : inventoryMembers.length;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-2 pb-4 bg-white rounded-lg shadow-md mt-1">
      <Toolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={TABS}
        hiddenTabs={[TabId.CustomId, TabId.Fields, TabId.Discussion]}
        partialHiddenTabs={[TabId.Access]}
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

      {activeTab === TabId.Fields && <FieldView inventoryId={inventoryId} />}
      {activeTab === TabId.CustomId && (
        <CustomIdView inventoryId={inventoryId} />
      )}
      {activeTab === TabId.Discussion && user && (
        <DiscussionView inventoryId={inventoryId} currentUser={user} />
      )}
    </div>
  );
};

export default ItemPage;
