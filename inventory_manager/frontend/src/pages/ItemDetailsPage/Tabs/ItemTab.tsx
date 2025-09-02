import React, { useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

import { Item, ItemFieldValue } from "../../../models/models";
import { useItemStore } from "../../../stores/useItemStore";
import Input from "../../../components/common/Input";

interface ItemInfoTabProps {
  item: Item;
}

const ItemTab: React.FC<ItemInfoTabProps> = ({ item }) => {
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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 md:w-1/3">
        <div className="bg-white p-4 rounded shadow flex flex-col gap-1">
          <span className="text-sm text-gray-500">Version</span>
          <span className="font-semibold">{item.version}</span>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col gap-1">
          <span className="text-sm text-gray-500">Created At</span>
          <span className="font-semibold">
            {new Date(item.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col gap-1">
          <span className="text-sm text-gray-500">Updated At</span>
          <span className="font-semibold">
            {new Date(item.updatedAt).toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 min-h-[6.5rem] rounded shadow flex flex-col gap-1">
          <span className="text-sm text-gray-500">Custom ID</span>
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
              />
            ) : (
              <>
                <span className="font-semibold">{customId}</span>
                <Pencil
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setEditingCustomId(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {item.fieldValues && item.fieldValues.length > 0 && (
        <div className="bg-white p-4 rounded shadow flex-1">
          <h3 className="text-lg font-semibold mb-2">Field Values</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            {item.fieldValues
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((fv: ItemFieldValue) => (
                <div
                  key={fv.id}
                  className="bg-gray-50 p-4 rounded flex flex-col gap-1"
                >
                  <span className="text-sm text-gray-500">
                    {fv.field?.name ?? fv.name ?? "Unnamed Field"}
                  </span>
                  <span className="font-semibold">
                    {fv.field?.type === "boolean" ? (
                      fv.value === "true" || fv.value === true ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : fv.field?.type === "file" && fv.value ? (
                      <a
                        href={fv.value as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Open file
                      </a>
                    ) : fv.value !== null && fv.value !== undefined ? (
                      String(fv.value)
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemTab;
