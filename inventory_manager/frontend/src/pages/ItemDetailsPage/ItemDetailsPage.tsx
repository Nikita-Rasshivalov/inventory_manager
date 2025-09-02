import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "react-toastify";
import Header from "../../components/layout/Header";
import { useItemStore } from "../../stores/useItemStore";
import { useInventoryStore } from "../../stores/useInventoryStore";
import Button from "../../components/common/Button";
import FieldsTab from "./Tabs/FieldsTab";
import ItemTab from "./Tabs/ItemTab";

enum TabId {
  ItemDetails = "Item Details",
  ItemFields = "Fields",
}

const TABS: TabId[] = [TabId.ItemDetails, TabId.ItemFields];

const ItemDetailsPage = () => {
  const { inventoryId, itemId } = useParams<{
    inventoryId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const { fetchItemById, currentItem, loading } = useItemStore();
  const { getById: getInventoryById } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.ItemDetails);

  useEffect(() => {
    const fetchData = async () => {
      if (!inventoryId || !itemId) return;

      try {
        await fetchItemById(Number(inventoryId), Number(itemId));
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch item or inventory");
      }
    };

    fetchData();
  }, [inventoryId, itemId, fetchItemById, getInventoryById]);

  if (loading || !currentItem)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
        <Loader />
      </div>
    );

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 mt-1 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft
            size={20}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-semibold">
            {currentItem.customId || `Item ${currentItem.id}`}
          </h2>
        </div>

        <div className="flex w-full justify-end gap-2 mb-4 pb-3 rounded-lg border-b border-gray-300">
          {TABS.map((tab) => (
            <Button
              key={tab}
              active={activeTab === tab}
              className="w-30 px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="space-y-4 mt-2">
          {activeTab === TabId.ItemDetails && <ItemTab item={currentItem} />}
          {activeTab === TabId.ItemFields && inventoryId && itemId && (
            <FieldsTab inventoryId={Number(inventoryId)} />
          )}
        </div>
      </div>
    </>
  );
};

export default ItemDetailsPage;
