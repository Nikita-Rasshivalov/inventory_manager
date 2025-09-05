import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ElementsList } from "../../components/common/ElementsList";
import { FieldControls } from "./FieldControls";
import { useFieldStore } from "../../stores/useFieldStore";

import { mapFieldToOption } from "./filedMapper";
import DragElement from "../../components/common/DragElementProps";

interface FieldViewProps {
  inventoryId: number;
}

const FieldView = ({ inventoryId }: FieldViewProps) => {
  const {
    fields: storeFields,
    getAll,
    create,
    error,
    remove,
  } = useFieldStore();
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    const mapped = storeFields
      .map(mapFieldToOption)
      .filter((f): f is NonNullable<typeof f> => f !== null);
    setFields(mapped);
  }, [storeFields]);

  const [newType, setNewType] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    getAll(inventoryId);
  }, [getAll, inventoryId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleAddField = async () => {
    if (!newType || !name) return;

    const typeCount = fields.filter((f) => f.type === newType).length;
    if (typeCount >= 3) {
      toast.error(`Cannot add more than 3 fields of type ${newType}`);
      return;
    }
    try {
      await create(inventoryId, {
        name,
        type: newType,
      });

      setNewType("");
      setName("");
      toast.success("Field added successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add field");
    }
  };

  const handleDelete = async (fieldId: number) => {
    try {
      const success = await remove(inventoryId, fieldId);
      if (success) toast.success("Field deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete field");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Customize Fields
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <FieldControls
            newType={newType}
            setNewType={setNewType}
            name={name}
            setName={setName}
            onAdd={handleAddField}
          />
        </div>

        <div className="md:w-2/3">
          <ElementsList
            elements={fields}
            setElements={setFields}
            getKey={(f) => f.id.toString()}
            renderElement={(field, _index, _onRemove, provided) => (
              <DragElement
                item={field}
                provided={provided}
                onRemove={() => handleDelete(field.id)}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FieldView;
