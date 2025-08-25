import React from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { Button } from "@headlessui/react";
import { getPageNumbers } from "../../../utils/pagination";

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
    <div className="space-y-4 relative">
      {children}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <Loader />
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-2">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </Button>

          {getPageNumbers(page, totalPages).map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded ${
                  p === page ? "bg-gray-500 text-white" : "bg-gray-200"
                }`}
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-3 py-1">
                {p}
              </span>
            )
          )}

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};
