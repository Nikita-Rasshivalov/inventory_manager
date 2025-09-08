import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "react-toastify";
import Header from "../../components/layout/Header";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import Button from "../../components/common/Button";
import FieldsTab from "./Tabs/FieldTab/FieldsTab";
import ItemTab from "./Tabs/ItemTab/ItemTab";
import LikeButton from "./LikeButton";
import { useAuthStore } from "../../stores/useAuthStore";
import { InventoryRole, SystemRole } from "../../models/models";

enum TabId {
  ItemDetails = "Item Details",
  ItemFields = "Fields",
}

const ItemDetailsPage = () => {
  const { inventoryId, itemId } = useParams<{
    inventoryId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const { fetchItemById, currentItem, loading } = useItemStore();
  const { getById: getInventoryById, inventoryMembers } = useInventoryStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.ItemDetails);

  useEffect(() => {
    const fetchData = async () => {
      if (!inventoryId || !itemId) return;

      try {
        await fetchItemById(Number(inventoryId), Number(itemId));
        await getInventoryById(Number(inventoryId));
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch item or inventory");
      }
    };

    fetchData();
  }, [inventoryId, itemId, fetchItemById, getInventoryById]);

  const canEditFields = useMemo(() => {
    if (!user) return false;
    if (user.role === SystemRole.ADMIN) return true;
    const member = inventoryMembers.find((m) => m.userId === user.id);
    return (
      member?.role === InventoryRole.OWNER ||
      member?.role === InventoryRole.WRITER
    );
  }, [user, inventoryMembers]);

  if (loading || !currentItem)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 z-10">
        <Loader className="text-gray-900 dark:text-white" />
      </div>
    );

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 mt-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft
            size={20}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-semibold truncate">
            {currentItem.customId || `Item ${currentItem.id}`}
          </h2>
        </div>

        <div className="flex w-full justify-between items-center gap-2 mb-4 pb-3 rounded-lg border-b border-gray-300 dark:border-gray-600 flex-wrap">
          {user && (
            <LikeButton
              itemId={currentItem.id}
              currentUser={user}
              initialLikes={currentItem.likes}
            />
          )}
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <Button
              active={activeTab === TabId.ItemDetails}
              className="flex-1 sm:flex-none min-w-[100px] px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate"
              onClick={() => setActiveTab(TabId.ItemDetails)}
            >
              {TabId.ItemDetails}
            </Button>

            {canEditFields && (
              <Button
                active={activeTab === TabId.ItemFields}
                className="flex-1 sm:flex-none min-w-[100px] px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate"
                onClick={() => setActiveTab(TabId.ItemFields)}
              >
                {TabId.ItemFields}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-2">
          {activeTab === TabId.ItemDetails && (
            <ItemTab item={currentItem} canEditFields={canEditFields} />
          )}
          {activeTab === TabId.ItemFields &&
            canEditFields &&
            inventoryId &&
            itemId && <FieldsTab inventoryId={Number(inventoryId)} />}
        </div>
      </div>
    </>
  );
};

export default ItemDetailsPage;
