import { useState } from "react";

interface Field {
  id: number;
  name: string;
  type: string;
  showInTable: boolean;
}

const FieldsTab = ({ inventoryId }: { inventoryId: number }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");

  const addField = () => {
    const newField: Field = {
      id: Date.now(),
      name: newFieldName,
      type: newFieldType,
      showInTable: true,
    };
    setFields([...fields, newField]);
    setNewFieldName("");
  };

  const removeField = (id: number) =>
    setFields(fields.filter((f) => f.id !== id));

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Field Name"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          className="border p-1 rounded"
        />
        <select
          value={newFieldType}
          onChange={(e) => setNewFieldType(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
        <button
          onClick={addField}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {fields.map((f) => (
          <li
            key={f.id}
            className="flex justify-between border p-2 mb-1 rounded"
          >
            <span>
              {f.name} ({f.type})
            </span>
            <button onClick={() => removeField(f.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldsTab;
