import React, { useState, useRef, useEffect } from "react";
import { InventoryMember, User, InventoryRole } from "../../../models/models";

interface MemberFormProps {
  members: InventoryMember[];
  users: User[];
  search: string;
  getAll: (search: string) => Promise<User[]>;
  updateInventory: (
    updates: {
      userId: number;
      role?: InventoryRole;
      action: "add" | "update" | "remove";
    }[]
  ) => Promise<void>;
  reloadMembers?: () => Promise<void>;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  members,
  search,
  getAll,
  updateInventory,
  reloadMembers,
}) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search.trim()) {
      setAvailableUsers([]);
      setShowDropdown(false);
      return;
    }

    const fetchUsers = async () => {
      const fetchedUsers = await getAll(search);
      const filteredUsers = fetchedUsers.filter(
        (u) => !members.some((m) => m.userId === u.id)
      );
      setAvailableUsers(filteredUsers);
      setShowDropdown(filteredUsers.length > 0);
    };

    fetchUsers();
  }, [search, members, getAll]);

  const handleAddMember = async (user: User) => {
    await updateInventory([
      {
        userId: user.id,
        role: InventoryRole.READER,
        action: "add",
      },
    ]);
    setAvailableUsers([]);
    setShowDropdown(false);
    if (reloadMembers) await reloadMembers();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!showDropdown) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      {showDropdown && (
        <div className="absolute -top-20 sm:-top-7 left-0 mt-1 w-full max-w-sm sm:max-w-md max-h-60 overflow-auto border border-gray-300 bg-white shadow-lg rounded z-60">
          {availableUsers.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-blue-100 cursor-pointer break-words"
              onClick={() => handleAddMember(user)}
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
