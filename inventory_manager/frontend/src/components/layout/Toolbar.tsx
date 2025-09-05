import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { Search } from "lucide-react";

interface ToolbarProps {
  selectedCount: number;
  totalCount: number;
  onCreate?: () => void;
  onDelete?: () => void;
  tabs: string[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
  filterText: string;
  onFilterChange: (value: string) => void;
  hiddenTabs: string[];
  partialHiddenTabs?: string[];
  isAuthenticated: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  onCreate,
  onDelete,
  tabs,
  activeTab,
  onChangeTab,
  filterText,
  onFilterChange,
  hiddenTabs = [],
  partialHiddenTabs = [],
  isAuthenticated,
}) => {
  const disabledDelete = selectedCount === 0;
  const [showSearch, setShowSearch] = useState(false);
  const shouldHideAllButtons = hiddenTabs.includes(activeTab);
  const shouldHideCreateButton = partialHiddenTabs.includes(activeTab);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 min-h-17 mb-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300">
      <div className="flex flex-row gap-2 items-center justify-center w-full sm:w-auto sm:flex-1 sm:justify-start relative">
        <div className="flex gap-2 items-center w-65 xl:w-full flex-1">
          {!shouldHideAllButtons &&
            !shouldHideCreateButton &&
            onCreate &&
            isAuthenticated && (
              <Button
                onClick={onCreate}
                className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg p-1 sm:p-2 transition-colors duration-200"
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

          {!shouldHideAllButtons && onDelete && isAuthenticated && (
            <Button
              disabled={disabledDelete}
              onClick={onDelete}
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 text-white dark:text-gray-200 rounded-lg p-1 sm:p-2 transition-colors duration-200"
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
          )}

          {!shouldHideAllButtons && !showSearch && (
            <Button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 text-white dark:text-gray-200 rounded-lg p-1 sm:p-2 transition-colors duration-200"
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
                className="w-full sm:w-40 h-8 sm:h-10 px-2 sm:px-3 text-sm sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => onChangeTab(tab)}
            active={activeTab === tab}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm md:text-[15px] font-medium text-center min-w-[90px] md:min-w-[120px] lg:min-w-[90px] transition-colors duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-gray-100"
                : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
