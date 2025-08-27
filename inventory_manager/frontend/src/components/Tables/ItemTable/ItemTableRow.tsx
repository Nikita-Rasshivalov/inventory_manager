import React, { useState } from "react";
import { ItemCells } from "./ItemCells";

interface ItemTableRowProps {
  rows: any[];
  page: number;
  limit: number;
  onUpdate: (itemId: number, values: Record<string, any>) => void;
}

const ItemTableRow: React.FC<ItemTableRowProps> = ({
  rows,
  page,
  limit,
  onUpdate,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [fieldDrafts, setFieldDrafts] = useState<Record<number, any>>({});

  const toggleExpanded = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
    setEditingRow(null);
  };

  const startEdit = (id: number, initialFields: Record<number, any>) => {
    setEditingRow(id);
    setFieldDrafts(initialFields);
  };

  const save = (row: any) => {
    if (editingRow !== null) {
      onUpdate(row.id, fieldDrafts);
    }
    setEditingRow(null);
  };

  return (
    <>
      {rows.map((row, idx) => {
        const isExpanded = expandedRow === row.id;
        const isEditing = editingRow === row.id;
        const initialFields = Object.fromEntries(
          (row.fieldValues ?? []).map((fv: any) => [fv.fieldId, fv.value])
        );
        return (
          <React.Fragment key={row.id ?? idx}>
            <ItemCells
              row={row}
              isExpanded={isExpanded}
              isEditing={isEditing}
              fieldDrafts={fieldDrafts}
              setFieldDrafts={setFieldDrafts}
              startEdit={() => startEdit(row.id, initialFields)}
              save={() => save(row)}
              toggleExpanded={() => toggleExpanded(row.id)}
              page={page}
              limit={limit}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ItemTableRow;
