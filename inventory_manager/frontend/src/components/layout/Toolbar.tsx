import React from "react";
import Button from "../common/Button";
import Input from "../common/Input";

interface ToolbarProps {
  selectedCount: number;
  totalCount: number;
  onCreate: () => void;
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

  return (
    <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div className="flex space-x-2">
        <Button
          onClick={onCreate}
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          aria-label="Create Inventory"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-5"
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

        <Button
          disabled={disabledDelete}
          onClick={onDelete}
          className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg"
          aria-label="Delete"
        >
          <svg
            className="w-4 h-5"
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
      </div>

      {tabs.length > 0 && onChangeTab && (
        <div className="flex space-x-2 ml-4">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => onChangeTab(tab)}
              active={activeTab === tab}
              className="px-3 py-1 rounded-lg font-medium transition-all duration-200"
            >
              {tab}
            </Button>
          ))}
        </div>
      )}

      <div className="flex-1">
        <Input
          type="text"
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Search by title..."
          className="border rounded px-2 py-1 w-full"
        />
      </div>
    </div>
  );
};

export default Toolbar;
