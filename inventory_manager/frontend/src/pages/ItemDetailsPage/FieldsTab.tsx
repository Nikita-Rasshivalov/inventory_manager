import React, { useEffect, useState } from "react";
import { ElementsList } from "../../components/common/ElementsList";
import { useItemStore } from "../../stores/useItemStore";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import DragElement from "../../components/common/DragElementProps";
import { useFieldStore } from "../../stores/useFieldStore";
import { toast } from "react-toastify";
import { Plus, Save } from "lucide-react";
import { ItemFieldValue } from "../../models/models";

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
      const existing = currentItem.fieldValues.map((fv) => ({
        ...fv,
        name: fv.field?.name,
      }));
      setItemFieldValues(existing);
    }
  }, [currentItem]);

  const handleAddFieldValue = () => {
    if (!selectedFieldId) return toast.error("Select a field");
    const field = fields.find((f) => f.id === selectedFieldId);
    if (!field) return toast.error("Field not found");

    const order =
      itemFieldValues.length > 0
        ? Math.max(...itemFieldValues.map((fv) => fv.order)) + 1
        : 1;

    setItemFieldValues([
      ...itemFieldValues,
      {
        fieldId: field.id,
        name: field.name,
        value,
        showInTable,
        order,
      } as ItemFieldValue,
    ]);

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
            value: fv.value,
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
      }));
      setItemFieldValues(existing);
      toast.success("Item field values saved!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save field values");
    }
  };

  return (
    <div className="space-y-4 md:flex md:space-y-0 md:gap-4">
      <div className="flex flex-col gap-2 md:w-1/3">
        <Select
          value={selectedFieldId?.toString() ?? ""}
          onChange={(e) => setSelectedFieldId(Number(e.target.value))}
          className="w-full min-[425px]:h-8"
        >
          <option value="" disabled>
            Select field
          </option>
          {fields.map((f) => (
            <option key={f.id} value={f.id.toString()}>
              {f.name}
            </option>
          ))}
        </Select>

        <Input
          type="text"
          value={value}
          placeholder="Value"
          onChange={(e) => setValue(e.target.value)}
          className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        />

        <div className="flex items-center gap-2">
          <Input
            type="checkbox"
            checked={showInTable}
            onChange={(e) => setShowInTable(e.target.checked)}
          />
          <div className="text-sm">Show in table</div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={handleAddFieldValue}
            className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
          >
            <Plus size={16} />
          </Button>
          <Button
            onClick={handleSave}
            className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
          >
            <Save size={16} />
          </Button>
        </div>
      </div>

      <div className="md:w-2/3 mt-4 md:mt-0">
        <ElementsList
          elements={itemFieldValues}
          setElements={setItemFieldValues}
          getKey={(fv, index) =>
            fv.id ? `${fv.id}` : `${fv.fieldId}-${index}`
          }
          renderElement={(fv, index, _onRemove, provided) => (
            <DragElement
              key={fv.id ?? fv.fieldId}
              item={fv}
              provided={provided}
              onRemove={() => handleRemoveFieldValue(index)}
              isCustom={true}
            />
          )}
        />
      </div>
    </div>
  );
};

export default FieldsTab;
