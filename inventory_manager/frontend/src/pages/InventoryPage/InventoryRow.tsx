import { useState } from "react";
import { Pencil } from "lucide-react";
import Checkbox from "../../components/common/Checkbox";
import { Inventory } from "../../models/models";
import { useInventoryStore } from "../../stores/useInventoryStore";

interface InventoryRowProps {
  inv: Inventory;
  selected: boolean;
  toggleSelect: (id: number) => void;
}

export const InventoryRow: React.FC<InventoryRowProps> = ({
  inv,
  selected,
  toggleSelect,
}) => {
  const { update } = useInventoryStore();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(inv.title);

  const save = () => {
    if (title.trim() && title !== inv.title) {
      update(inv.id, { title });
    }
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center p-4 hover:bg-gray-50 space-x-4">
        <Checkbox checked={selected} onChange={() => toggleSelect(inv.id)} />
        <div
          className="flex-1 flex justify-between items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex flex-col">
            <div className="font-medium flex items-center gap-2">
              {editing ? (
                <input
                  className="border rounded px-2 py-1 flex-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={save}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                  autoFocus
                />
              ) : (
                <>
                  <span>{title}</span>
                  {expanded && (
                    <Pencil
                      size={16}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(true);
                      }}
                    />
                  )}
                </>
              )}
            </div>
            <div className="text-gray-400 text-sm">
              Owner: {inv.owner?.name || "N/A"} | Members: {inv.members.length}{" "}
              | Created: {new Date(inv.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="p-4 bg-gray-50 border-l-4 border-blue-500 ml-8">
          <p className="text-gray-600 italic">Detail (placeholder)</p>
        </div>
      )}
    </div>
  );
};
