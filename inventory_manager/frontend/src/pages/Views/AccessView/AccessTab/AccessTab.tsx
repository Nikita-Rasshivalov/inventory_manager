import React from "react";
import { MembersTable } from "../../../../components/Tables/MembersTable/MembersTable";
import {
  InventoryMember,
  InventoryRole,
  MemberAction,
} from "../../../../models/models";
import { useUserStore } from "../../../../stores/useUserStore";
import { MemberForm } from "./MemberForm";

interface AccessTabProps {
  inventoryId: number;
  members: InventoryMember[];
  search: string;
  updateMembers: (
    inventoryId: number,
    updates: {
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }[]
  ) => Promise<void>;
  selectedIds: number[];
  toggleSelect: (userId: number) => void;
}

export const AccessTab: React.FC<AccessTabProps> = ({
  inventoryId,
  members,
  search,
  updateMembers,
  selectedIds,
  toggleSelect,
}) => {
  const { getAll, users } = useUserStore();

  const handleUpdateMembers = async (
    updates: {
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }[]
  ) => {
    await updateMembers(inventoryId, updates);
  };

  return (
    <div className="relative flex flex-col gap-4 w-full">
      <MemberForm
        members={members}
        users={users}
        getAll={getAll}
        updateInventory={handleUpdateMembers}
        search={search}
      />
      <div className="border border-gray-200 rounded bg-white w-full overflow-auto">
        <MembersTable
          members={members}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
        />
      </div>
    </div>
  );
};
