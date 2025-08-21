import React from "react";
import Button from "../common/Button";

interface ToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  onCreate: () => void;
  onDelete: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onCreate,
  onDelete,
}) => {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const disabledDelete = selectedCount === 0;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="w-8 h-8 text-blue-600 rounded"
        />
      </label>

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
          className=" flex items-center justify-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg"
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

      <div className="ml-auto text-sm font-medium text-gray-600 select-none">
        {selectedCount} selected
      </div>
    </div>
  );
};

export default Toolbar;
