import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  InventoryMember,
  InventoryRole,
  MemberAction,
  User,
} from "../../../models/models";
import { useDebounce } from "../../../hooks/useDebounce";

interface MemberFormProps {
  members: InventoryMember[];
  users: User[];
  search: string;
  getAll: (search: string) => Promise<User[]>;
  updateInventory: (
    updates: {
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }[]
  ) => Promise<void>;
}

const debounce: number = 300;

export const MemberForm: React.FC<MemberFormProps> = ({
  members,
  search,
  getAll,
  updateInventory,
}) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, debounce);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setAvailableUsers([]);
      setShowDropdown(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAll(debouncedSearch);
        const filteredUsers = fetchedUsers.filter(
          (u) => !members.some((m) => m.userId === u.id)
        );
        setAvailableUsers(filteredUsers);
        setShowDropdown(filteredUsers.length > 0);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [debouncedSearch, members, getAll]);

  const handleAddMember = async (user: User) => {
    try {
      await updateInventory([
        {
          userId: user.id,
          role: InventoryRole.READER,
          action: MemberAction.Add,
        },
      ]);
      setAvailableUsers([]);
      setShowDropdown(false);
      toast.success(`${user.name} added successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || `Failed to add ${user.name}`);
    }
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

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`absolute -top-17 sm:-top-7 left-0 mt-1 w-full max-w-sm sm:max-w-md max-h-60 overflow-auto 
          border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 shadow-lg rounded z-60 
          ${showDropdown ? "block" : "hidden"}`}
      >
        {availableUsers.map((user) => (
          <div
            key={user.id}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer break-words text-gray-900 dark:text-gray-100"
            onClick={() => handleAddMember(user)}
          >
            {user.name} ({user.email})
          </div>
        ))}
      </div>
    </div>
  );
};
