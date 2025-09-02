import React, { useEffect, useState } from "react";
import { useItemStore } from "../../../stores/useItemStore";
import { useFieldStore } from "../../../stores/useFieldStore";
import { toast } from "react-toastify";
import { ItemFieldValue } from "../../../models/models";
import FieldSelector from "./FieldSelector";
import FieldValueForm from "./FieldValueForm";
import FieldValuesList from "./FieldValuesList";

interface FieldsTabProps {
  inventoryId: number;
}

const FieldsTab: React.FC<FieldsTabProps> = ({ inventoryId }) => {
  const { fields, getAll } = useFieldStore();
  const currentItem = useItemStore((s) => s.currentItem);
  const update = useItemStore((s) => s.update);
  const setCurrentItem = useItemStore((s) => s.setCurrentItem);

  const [itemFieldValues, setItemFieldValues] = useState<ItemFieldValue[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [showInTable, setShowInTable] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    getAll(inventoryId);
  }, [inventoryId, getAll]);

  useEffect(() => {
    if (currentItem?.fieldValues) {
      const existing = currentItem.fieldValues
        .map((fv) => ({
          ...fv,
          name: fv.field?.name,
          order: fv.order ?? 0,
          value: fv.value ?? null,
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setItemFieldValues(existing);
    }
  }, [currentItem]);

  const handleAddOrUpdateFieldValue = (newField: ItemFieldValue) => {
    if (editingIndex !== null) {
      const updated = [...itemFieldValues];
      updated[editingIndex] = { ...updated[editingIndex], ...newField };
      setItemFieldValues(updated);
      setEditingIndex(null);
    } else {
      setItemFieldValues([...itemFieldValues, newField]);
    }
    setSelectedFieldId(null);
    setValue(null);
    setShowInTable(false);
  };

  const handleRemoveFieldValue = (index: number) => {
    const updated = [...itemFieldValues];
    updated.splice(index, 1);
    setItemFieldValues(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
      setSelectedFieldId(null);
      setValue(null);
      setShowInTable(false);
    }
  };

  const handleSelectFieldValue = (index: number) => {
    const fv = itemFieldValues[index];
    setSelectedFieldId(fv.fieldId);
    setValue(
      fv.value !== null && fv.value !== undefined ? String(fv.value) : ""
    );
    setShowInTable(fv.showInTable);
    setEditingIndex(index);
  };

  const handleSave = async () => {
    if (!currentItem) return;

    const finalValues = [...itemFieldValues];
    if (editingIndex !== null) {
      finalValues[editingIndex] = {
        ...finalValues[editingIndex],
        value,
        showInTable,
      };
    }

    try {
      const updatedItem = await update(
        currentItem.inventoryId,
        currentItem.id,
        {
          fieldValues: finalValues.map((fv, index) => ({
            id: fv.id,
            fieldId: fv.fieldId,
            value:
              typeof fv.value === "boolean" || typeof fv.value === "number"
                ? JSON.stringify(fv.value)
                : fv.value,
            showInTable: fv.showInTable,
            order: index + 1,
          })),
          version: currentItem.version,
        }
      );

      setCurrentItem(updatedItem);

      const existing = updatedItem.fieldValues.map((fv) => ({
        ...fv,
        name: fv.field?.name,
        value: fv.value ?? null,
      }));

      setItemFieldValues(existing);
      setEditingIndex(null);
      setSelectedFieldId(null);
      setValue(null);
      setShowInTable(false);
      toast.success("Item field values saved!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save field values");
    }
  };

  const onAddField = () => {
    if (!selectedFieldId) return toast.error("Select a field");

    const exists = itemFieldValues.some(
      (fv, idx) => fv.fieldId === selectedFieldId && idx !== editingIndex
    );

    if (exists) {
      return toast.error(
        "This field is already added. You cannot add duplicates."
      );
    }

    const field = fields.find((f) => f.id === selectedFieldId);
    if (!field) return toast.error("Field not found");

    const newField: ItemFieldValue = {
      fieldId: field.id,
      name: field.name,
      value,
      showInTable,
      order:
        editingIndex !== null
          ? itemFieldValues[editingIndex].order
          : itemFieldValues.length + 1,
    };

    handleAddOrUpdateFieldValue(newField);
  };

  return (
    <div className="space-y-4 md:flex md:space-y-0 md:gap-4">
      <div className="flex flex-col gap-2 md:w-1/3">
        <FieldSelector
          fields={fields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />
        <FieldValueForm
          fields={fields}
          selectedFieldId={selectedFieldId}
          value={value}
          setValue={setValue}
          showInTable={showInTable}
          setShowInTable={setShowInTable}
          onAddField={onAddField}
          onSave={handleSave}
        />
      </div>
      <FieldValuesList
        itemFieldValues={itemFieldValues}
        setItemFieldValues={setItemFieldValues}
        onRemove={handleRemoveFieldValue}
        onSelect={handleSelectFieldValue}
      />
    </div>
  );
};

export default FieldsTab;
