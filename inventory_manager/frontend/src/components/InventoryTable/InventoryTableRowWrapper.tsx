import React, { useState } from "react";
import { InventoryRowDetails } from "../InventoryRowDetails/InventoryRowDetails";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableRowWrapperProps {
  rows: any[];
}

const InventoryTableRowWrapper: React.FC<InventoryTableRowWrapperProps> = ({
  rows,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const { update } = useInventoryStore();

  const toggleExpanded = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
    setEditingRow(null);
  };

  const startEdit = (id: number, current: string) => {
    setEditingRow(id);
    setTitleDraft(current);
  };

  const save = (row: any) => {
    if (titleDraft.trim() && titleDraft !== row.original.title) {
      update(row.original.id, { title: titleDraft });
    }
    setEditingRow(null);
  };

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {rows.map((row, idx) => {
        const isExpanded = expandedRow === row.id;
        const isEditing = editingRow === row.id;

        return (
          <React.Fragment key={row.id ?? idx}>
            <InventoryTableRow
              row={row}
              idx={idx}
              isExpanded={isExpanded}
              isEditing={isEditing}
              titleDraft={titleDraft}
              setTitleDraft={setTitleDraft}
              startEdit={startEdit}
              save={save}
              toggleExpanded={() => toggleExpanded(row.id)}
            />
            {isExpanded && (
              <InventoryRowDetails colSpan={row.getVisibleCells().length} />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};

export default InventoryTableRowWrapper;
