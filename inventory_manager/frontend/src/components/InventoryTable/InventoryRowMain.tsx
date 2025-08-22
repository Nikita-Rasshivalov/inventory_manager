import React from "react";
import { Pencil } from "lucide-react";
import { flexRender } from "@tanstack/react-table";

interface InventoryRowMainProps {
  row: any;
  idx: number;
  isExpanded: boolean;
  isEditing: boolean;
  titleDraft: string;
  setTitleDraft: (value: string) => void;
  startEdit: (id: number, current: string) => void;
  save: (row: any) => void;
  toggleExpanded: () => void;
}

export const InventoryRowMain: React.FC<InventoryRowMainProps> = ({
  row,
  idx,
  isExpanded,
  isEditing,
  titleDraft,
  setTitleDraft,
  startEdit,
  save,
  toggleExpanded,
}) => {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={toggleExpanded}>
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          style={{ width: cell.column.columnDef.size }}
          className="px-4 py-2 text-sm text-gray-700"
        >
          {cell.column.id === "number" ? (
            idx + 1
          ) : cell.column.id === "title" ? (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  className="border rounded px-2 py-1 flex-1"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => save(row)}
                  onKeyDown={(e) => e.key === "Enter" && save(row)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span>{row.original.title}</span>
                  {isExpanded && (
                    <Pencil
                      size={16}
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(row.id, row.original.title);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </td>
      ))}
    </tr>
  );
};
