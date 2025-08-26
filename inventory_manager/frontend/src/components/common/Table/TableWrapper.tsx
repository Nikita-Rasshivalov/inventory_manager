import React from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Button } from "@headlessui/react";
import { getPageNumbers } from "../../../utils/pagination";
import { PageItem } from "./PageItem";

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
      <div className="relative overflow-x-auto border rounded-lg">
        {children}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
            <Loader />
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-2">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </Button>

          {getPageNumbers(page, totalPages).map((p, idx) => (
            <PageItem key={idx} p={p} page={page} onPageChange={onPageChange} />
          ))}

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </>
  );
};
