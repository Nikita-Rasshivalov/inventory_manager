import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { toast } from "react-toastify";
import Header from "../components/layout/Header";
import { useItemStore } from "../stores/useItemStore";
import { useInventoryStore } from "../stores/useInventoryStore";
import { Item } from "../models/models";
import Button from "../components/common/Button";
import ItemView from "../Views/FieldView/ItemViev";

enum TabId {
  ItemDetails = "Item Details",
}

const TABS: TabId[] = [TabId.ItemDetails];

const ItemDetailsPage = () => {
  const { inventoryId, itemId } = useParams<{
    inventoryId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const { getById: getItemById, loading } = useItemStore();
  const { getById: getInventoryById } = useInventoryStore();

  const [item, setItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>(TabId.ItemDetails);

  useEffect(() => {
    const fetchData = async () => {
      if (!inventoryId || !itemId) return;

      try {
        const itm = await getItemById(Number(inventoryId), Number(itemId));
        setItem(itm);
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch item or inventory");
      }
    };

    fetchData();
  }, [inventoryId, itemId, getInventoryById, getItemById]);

  if (loading)
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
            {item?.customId || `Item ${item?.id}`}
          </h2>
        </div>

        <div className="flex w-full justify-end gap-2 mb-4 pb-3 rounded-lg border-b border-gray-300">
          {TABS.map((tab) => (
            <Button
              key={tab}
              active={activeTab === tab}
              className=" w-30 px-2 py-1 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {!item ? (
          <div className="text-center text-gray-500 py-10">No item found</div>
        ) : (
          <div className="space-y-4 mt-2">
            {activeTab === TabId.ItemDetails && <ItemView item={item} />}
          </div>
        )}
      </div>
    </>
  );
};

export default ItemDetailsPage;
