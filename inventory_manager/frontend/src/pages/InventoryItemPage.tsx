import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";
import ItemPage from "./ItemPage/ItemPage";
import { useInventoryStore } from "../stores/useInventoryStore";

const InventoryItemPage = () => {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const location = useLocation();
  const { update } = useInventoryStore();

  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(
    (location.state?.inventoryTitle as string) || ""
  );

  const handleSave = () => {
    if (titleDraft.trim()) {
      update(Number(inventoryId), { title: titleDraft });
      setIsEditing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        {isEditing ? (
          <input
            className="border rounded px-2 py-1 text-xl font-semibold flex-1"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold flex-1">{titleDraft}</h1>
            <Pencil
              size={20}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          </>
        )}
      </div>

      <ItemPage inventoryId={Number(inventoryId)} />
    </div>
  );
};

export default InventoryItemPage;
