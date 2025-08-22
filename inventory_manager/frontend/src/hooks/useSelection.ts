import { useState, useCallback } from "react";

export const useSelection = <T extends { id: number }>(items: T[] = []) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? items.map((i) => i.id) : []);
    },
    [items]
  );

  const isSelected = useCallback(
    (id: number) => selectedIds.includes(id),
    [selectedIds]
  );

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    isSelected,
    clearSelection,
  };
};
