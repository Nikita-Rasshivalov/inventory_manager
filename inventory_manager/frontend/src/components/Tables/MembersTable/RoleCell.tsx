import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  InventoryMember,
  InventoryRole,
  MemberAction,
} from "../../../models/models";
import Select from "../../common/Select";
import { useInventoryStore } from "../../../stores/useInventoryStore";

interface RoleCellProps {
  member: InventoryMember;
  inventoryId: number;
}

export const RoleCell: React.FC<RoleCellProps> = ({ member, inventoryId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateMembers = useInventoryStore((s) => s.updateMembers);

  const handleChange = async (newRole: InventoryRole) => {
    await updateMembers(inventoryId, [
      { userId: member.userId, role: newRole, action: MemberAction.Update },
    ]);
    setIsEditing(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {isEditing ? (
        <div className="absolute z-10">
          <Select
            autoFocus
            defaultValue={member.role}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => handleChange(e.target.value as InventoryRole)}
            options={Object.values(InventoryRole).map((r) => ({
              label: r,
              value: r,
            }))}
            className="w-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
          />
        </div>
      ) : (
        <>
          <span className="text-gray-700 dark:text-gray-200">
            {member.role}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Pencil size={14} />
          </button>
        </>
      )}
    </div>
  );
};
