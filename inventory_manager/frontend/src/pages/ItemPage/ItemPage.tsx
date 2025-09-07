import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Toolbar from "../../components/layout/Toolbar";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { useSelection } from "../../hooks/useSelection";
import { InventoryRole, MemberAction, SystemRole } from "../../models/models";
import { AccessView } from "../../Views/AccessView/AccessView";
import { ItemsView } from "../../Views/ItemsView/ItemsView";
import FieldView from "../../Views/FieldView/FieldView";
import { DiscussionView } from "../../Views/DiscussionView/DiscussionView";
import { useAuthStore } from "../../stores/useAuthStore";
import StatisticsView from "../../Views/StatisticsView/StatisticsView";
import { useDebounce } from "../../hooks/useDebounce";
import SettingsView from "../../Views/SettingsView/SettingsView";

enum TabId {
  Items = "Items",
  Access = "Access",
  Fields = "Fields",
  Discussion = "Discussion",
  Statistics = "Statistics",
  Settings = "Settings",
}

const ALL_TABS: TabId[] = [
  TabId.Items,
  TabId.Access,
  TabId.Fields,
  TabId.Discussion,
  TabId.Settings,
  TabId.Statistics,
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
    setSearch,
    setSorting,
  } = useItemStore();
  const { user } = useAuthStore();
  const { inventoryMembers, updateMembers, getById } = useInventoryStore();

  const [filterText, setFilterText] = useState("");
  const debouncedFilter = useDebounce(filterText, 300);

  const itemsSelection = useSelection(items);
  const membersSelection = useSelection(inventoryMembers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>(
    (searchParams.get("tab") as TabId) || TabId.Items
  );

  const loadItems = useCallback(
    () => getAll(inventoryId),
    [inventoryId, getAll]
  );

  const isAdminOrOwner = useMemo(() => {
    if (!user) return false;
    if (user.role === SystemRole.ADMIN) return true;
    const members = inventoryMembers || [];
    const member = members.find((m) => m.userId === user.id);
    return member?.role === InventoryRole.OWNER;
  }, [user, inventoryMembers]);

  const visibleTabs = useMemo(() => {
    if (isAdminOrOwner) return ALL_TABS;
    return ALL_TABS.filter(
      (t) => t !== TabId.Access && t !== TabId.Settings && t !== TabId.Fields
    );
  }, [isAdminOrOwner]);

  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      if (activeTab !== TabId.Settings) {
        setActiveTab(TabId.Items);
      }
    }
  }, [activeTab, visibleTabs]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
    setSearchParams(params, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  useEffect(() => {
    getById(inventoryId);
  }, [inventoryId, getById]);

  useEffect(() => {
    if (activeTab === TabId.Items) loadItems();
  }, [activeTab, loadItems]);

  useEffect(() => {
    if (activeTab === TabId.Items) {
      setSearch(debouncedFilter);
      getAll(inventoryId);
    }
  }, [debouncedFilter, activeTab, inventoryId, setSearch, getAll]);

  const handleSortChange = (sortBy?: string, sortOrder?: "asc" | "desc") => {
    setSorting(sortBy, sortOrder);
    getAll(inventoryId);
  };

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
      ? itemsSelection.selectedIds?.length || 0
      : membersSelection.selectedIds?.length || 0;
  const totalCount =
    activeTab === TabId.Items
      ? items?.length || 0
      : inventoryMembers?.length || 0;

  const showCheckboxes = isAdminOrOwner;
  return (
    <div className="max-w-6xl mx-auto px-6 pt-2 pb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md mt-1 transition-colors duration-300">
      <Toolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={visibleTabs}
        hiddenTabs={[
          TabId.Discussion,
          TabId.Statistics,
          TabId.Fields,
          TabId.Settings,
        ]}
        partialHiddenTabs={[TabId.Access]}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab as TabId)}
        filterText={filterText}
        onFilterChange={setFilterText}
        isAuthenticated={!!user}
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
          setSorting={handleSortChange}
          isModalOpen={isModalOpen}
          onCreate={handleCreate}
          onCloseModal={() => setIsModalOpen(false)}
          showCheckboxes={showCheckboxes}
        />
      )}

      {activeTab === TabId.Access && isAdminOrOwner && (
        <AccessView
          inventoryId={inventoryId}
          members={inventoryMembers}
          search={filterText}
          updateMembers={updateMembers}
          selectedIds={membersSelection.selectedIds}
          toggleSelect={membersSelection.toggleSelect}
        />
      )}

      {activeTab === TabId.Fields && isAdminOrOwner && (
        <FieldView inventoryId={inventoryId} />
      )}
      {activeTab === TabId.Settings && isAdminOrOwner && (
        <SettingsView inventoryId={inventoryId} />
      )}
      {activeTab === TabId.Discussion && (
        <DiscussionView inventoryId={inventoryId} currentUser={user} />
      )}
      {activeTab === TabId.Statistics && <StatisticsView items={items} />}
    </div>
  );
};

export default ItemPage;
