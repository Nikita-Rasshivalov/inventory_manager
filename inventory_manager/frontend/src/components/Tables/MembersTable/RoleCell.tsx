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
            className="w-24"
          />
        </div>
      ) : (
        <>
          <span>{member.role}</span>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Pencil size={14} />
          </button>
        </>
      )}
    </div>
  );
};
