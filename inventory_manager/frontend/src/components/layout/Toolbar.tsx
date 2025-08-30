import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { Search } from "lucide-react";

interface ToolbarProps {
  selectedCount: number;
  totalCount: number;
  onCreate?: () => void;
  onDelete: () => void;
  tabs?: string[];
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
  filterText: string;
  onFilterChange: (value: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  onCreate,
  onDelete,
  tabs = [],
  activeTab,
  onChangeTab,
  filterText,
  onFilterChange,
}) => {
  const disabledDelete = selectedCount === 0;
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-row gap-2 items-center w-full sm:w-auto sm:flex-1 sm:justify-start relative">
        <div className="flex gap-2 items-center">
          {onCreate && (
            <Button
              onClick={onCreate}
              className="flex items-center justify-center text-white rounded-lg p-1 sm:p-2"
              aria-label="Create Inventory"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
          )}

          <Button
            disabled={disabledDelete}
            onClick={onDelete}
            className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg p-1 sm:p-2"
            aria-label="Delete"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-4h4m-6 4v12m4-12v12"
              />
            </svg>
          </Button>

          {!showSearch && (
            <Button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg p-1 sm:p-2"
              aria-label="Show search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}

          {showSearch && (
            <div className="absolute top-0 left-0 w-full sm:static sm:flex sm:ml-2 sm:flex-shrink-0">
              <Input
                type="text"
                value={filterText}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Search..."
                autoFocus
                onBlur={() => setShowSearch(false)}
                className="w-full sm:w-60 h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {tabs.length > 0 && onChangeTab && (
        <div className="flex w-full gap-2 sm:flex-wrap sm:w-auto sm:flex-row sm:justify-end">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => onChangeTab(tab)}
              active={activeTab === tab}
              className="flex-1 px-2 py-1 rounded-lg text-sm sm:text-base font-medium truncate"
            >
              {tab}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Toolbar;
