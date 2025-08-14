import React from "react";
import Button from "../common/Button";

interface ToolbarProps {
  selectedCount: number;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  onBlock,
  onUnblock,
  onDelete,
}) => {
  const disabled = selectedCount === 0;

  return (
    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <Button
        disabled={disabled}
        onClick={onBlock}
        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-4-6v-2a4 4 0 118 0v2m-8 0h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4a2 2 0 012-2z"
          />
        </svg>
      </Button>
      <Button
        disabled={disabled}
        onClick={onUnblock}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300"
        aria-label="Unblock"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11V7a3 3 0 10-6 0m10 4H5a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2z"
          />
        </svg>
      </Button>
      <Button
        disabled={disabled}
        onClick={onDelete}
        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300"
        aria-label="Delete"
      >
        <svg
          className="w-5 h-5 inline-block"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-4h4m-6 4v12m4-12v12"
          ></path>
        </svg>
      </Button>
      <div className="ml-auto text-sm font-medium text-gray-600 select-none">
        {selectedCount} selected
      </div>
    </div>
  );
};

export default Toolbar;
