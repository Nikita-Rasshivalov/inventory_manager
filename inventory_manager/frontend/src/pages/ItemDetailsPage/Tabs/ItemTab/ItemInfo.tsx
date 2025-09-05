import React, { useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { useItemStore } from "../../../../stores/useItemStore";
import { Item } from "../../../../models/models";
import Input from "../../../../components/common/Input";

interface ItemInfoProps {
  item: Item;
  canEditFields: boolean;
}

const ItemInfo: React.FC<ItemInfoProps> = ({ item, canEditFields }) => {
  const update = useItemStore((s) => s.update);
  const setCurrentItem = useItemStore((s) => s.setCurrentItem);

  const [editingCustomId, setEditingCustomId] = useState(false);
  const [customId, setCustomId] = useState(item.customId);

  const handleSaveCustomId = async () => {
    if (customId === item.customId) {
      setEditingCustomId(false);
      return;
    }
    try {
      const updatedItem = await update(item.inventoryId, item.id, {
        customId,
        version: item.version,
      });
      setCurrentItem(updatedItem);
      toast.success("Custom ID updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update Custom ID");
      setCustomId(item.customId);
    } finally {
      setEditingCustomId(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 md:w-1/3">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col gap-1 transition-colors duration-300">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Version
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {item.version}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col gap-1 transition-colors duration-300">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Created At
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col gap-1 transition-colors duration-300">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated At
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {new Date(item.updatedAt).toLocaleString()}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 min-h-[6.5rem] rounded shadow flex flex-col gap-1 transition-colors duration-300">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Custom ID
        </span>
        <div className="flex items-center gap-2">
          {editingCustomId ? (
            <Input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              onBlur={handleSaveCustomId}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveCustomId();
                if (e.key === "Escape") {
                  setCustomId(item.customId);
                  setEditingCustomId(false);
                }
              }}
              autoFocus
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
            />
          ) : (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {customId}
              </span>
              {canEditFields && (
                <Pencil
                  size={16}
                  className="cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setEditingCustomId(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemInfo;
