import { useEffect, useCallback, useState } from "react";
import Toolbar from "../../components/layout/Toolbar";
import GenericModal from "../../components/layout/Modal";
import { useSelection } from "../../hooks/useSelection";
import { useInventoryActions } from "./hooks/useInventoryActions";
import { InventoryRole, InventoryTabId, SystemRole } from "../../models/models";
import { useInventoryStore } from "../../stores/useInventoryStore";
import InventoryTable from "../../components/Tables/InventoryTable/InventoryTable";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

const debounceTime = 400;

const InventoryPage = () => {
  const { t } = useTranslation();
  const { createInventory, deleteInventories } = useInventoryActions();
  const { user } = useAuth();
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
    limit,
    sorting,
    setSorting,
    currentUser,
    setCurrentUser,
  } = useInventoryStore();

  const TABS: InventoryTabId[] =
    user?.role === SystemRole.ADMIN
      ? [InventoryTabId.All]
      : [InventoryTabId.Own, InventoryTabId.Member, InventoryTabId.All];

  const isAdmin = user?.role === SystemRole.ADMIN;
  const showCheckboxes = isAdmin || activeTab === InventoryTabId.Own;

  const debouncedSearch = useDebounce(search, debounceTime);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedIds, toggleSelect, clearSelection } =
    useSelection(inventories);

  useEffect(() => {
    if (user && (!currentUser || currentUser.id !== user.id)) {
      setCurrentUser(user);
    }
  }, [user, currentUser, setCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      getAll();
    }
  }, [page, activeTab, debouncedSearch, sorting, getAll, currentUser]);

  const handleFilterChange = (text: string) => setSearch(text);

  const handleTabChange = useCallback(
    (tab: InventoryTabId) => {
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

  const handleCreate = async (values: Record<string, any>) => {
    const title = values["title"];
    const isPublic = values["isPublic"] ?? false;
    if (!title || !user) return;
    await createInventory({ title, isPublic });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-8xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-lg shadow-md mt-3 transition-colors duration-300">
      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={inventories.length}
        hiddenTabs={[InventoryRole.READER, InventoryRole.WRITER]}
        onDelete={handleDelete}
        onCreate={() => setIsModalOpen(true)}
        tabs={TABS}
        activeTab={activeTab}
        onChangeTab={(tab) => handleTabChange(tab as InventoryTabId)}
        filterText={search}
        onFilterChange={handleFilterChange}
        isAuthenticated={!!user}
      />

      <InventoryTable
        inventories={inventories}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        setSorting={setSorting}
        showCheckboxes={showCheckboxes}
      />

      {isModalOpen && (
        <GenericModal
          title={t("create_inventory")}
          fields={[
            { name: "title", label: t("title") },
            {
              name: "isPublic",
              label: t("public"),
              type: "checkbox",
              initialBooleanValue: false,
            },
          ]}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default InventoryPage;
