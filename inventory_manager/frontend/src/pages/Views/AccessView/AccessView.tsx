import React from "react";
import { AccessTab } from "./AccessTab/AccessTab";
import { InventoryMember } from "../../../models/models";

interface AccessViewProps {
  inventoryId: number;
  members: InventoryMember[];
  search: string;
  updateMembers: any;
  selectedIds: number[];
  toggleSelect: (id: number) => void;
}

export const AccessView: React.FC<AccessViewProps> = ({
  inventoryId,
  members,
  search,
  updateMembers,
  selectedIds,
  toggleSelect,
}) => (
  <AccessTab
    inventoryId={inventoryId}
    members={members}
    search={search}
    updateMembers={updateMembers}
    selectedIds={selectedIds}
    toggleSelect={toggleSelect}
  />
);
