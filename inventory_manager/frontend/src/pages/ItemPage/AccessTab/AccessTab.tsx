import React from "react";
import { MembersTable } from "../../../components/Tables/MembersTable/MembersTable";
import { InventoryMember, InventoryRole } from "../../../models/models";
import { useInventoryStore } from "../../../stores/useInventoryStore";
import { useUserStore } from "../../../stores/useUserStore";
import { MemberForm } from "./MemberForm";

export interface AccessTabProps {
  inventoryId: number;
  members: InventoryMember[];
  search: string;
  reloadMembers?: () => Promise<void>;
}

export const AccessTab: React.FC<AccessTabProps> = ({
  inventoryId,
  members,
  search,
  reloadMembers,
}) => {
  const { updateMembers } = useInventoryStore();
  const { getAll, users } = useUserStore();

  const handleUpdateMembers = async (
    updates: {
      userId: number;
      role?: InventoryRole;
      action: "add" | "update" | "remove";
    }[]
  ) => {
    await updateMembers(inventoryId, updates);
    if (reloadMembers) await reloadMembers();
  };

  return (
    <>
      <div className="p-2 bg-gray-50 flex flex-col gap-6 w-full">
        <MemberForm
          members={members}
          users={users}
          getAll={getAll}
          updateInventory={handleUpdateMembers}
          reloadMembers={reloadMembers}
          search={search}
        />
      </div>
      <div className="border border-gray-200 rounded bg-white w-full  overflow-auto">
        <MembersTable members={members} />
      </div>
    </>
  );
};
