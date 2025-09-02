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
  const [value, setValue] = useState<string>("");
  const [showInTable, setShowInTable] = useState<boolean>(false);

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
          value: fv.value ?? null, // строго string | null
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setItemFieldValues(existing);
    }
  }, [currentItem]);

  const handleAddFieldValue = (newField: ItemFieldValue) => {
    setItemFieldValues([...itemFieldValues, newField]);
    setSelectedFieldId(null);
    setValue("");
    setShowInTable(false);
  };

  const handleRemoveFieldValue = (index: number) => {
    const updated = [...itemFieldValues];
    updated.splice(index, 1);
    setItemFieldValues(updated);
  };

  const handleSave = async () => {
    if (!currentItem) return;

    try {
      const updatedItem = await update(
        currentItem.inventoryId,
        currentItem.id,
        {
          fieldValues: itemFieldValues.map((fv, index) => ({
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
      toast.success("Item field values saved!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save field values");
    }
  };

  const onAddField = () => {
    if (!selectedFieldId) return toast.error("Select a field");

    if (itemFieldValues.some((fv) => fv.fieldId === selectedFieldId)) {
      return toast.error("This field is already added");
    }

    const field = fields.find((f) => f.id === selectedFieldId);
    if (!field) return toast.error("Field not found");

    handleAddFieldValue({
      fieldId: field.id,
      name: field.name,
      value,
      showInTable,
      order: itemFieldValues.length + 1,
    } as ItemFieldValue);
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
      />
    </div>
  );
};

export default FieldsTab;
