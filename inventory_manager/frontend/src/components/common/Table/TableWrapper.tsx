import React from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { getPageNumbers } from "../../../utils/pagination";
import { PageItem } from "./PageItem";
import Button from "../Button";

interface TableWrapperProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  loading?: boolean;
  children: React.ReactNode;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  page,
  totalPages,
  onPageChange,
  loading = false,
  children,
}) => {
  return (
    <>
      <div className="relative overflow-x-auto border border-gray-300/70 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
        {children}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60 z-10">
            <Loader className="text-gray-700 dark:text-gray-200" />
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-2">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded text-gray-900 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200"
          >
            <ChevronLeft size={18} />
          </Button>

          {getPageNumbers(page, totalPages).map((p, idx) => (
            <PageItem key={idx} p={p} page={page} onPageChange={onPageChange} />
          ))}

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded text-gray-900 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </>
  );
};
