import { useState } from "react";

const CustomIdTab = ({ inventoryId }: { inventoryId: number }) => {
  const [format, setFormat] = useState("");

  const saveFormat = () => {
    console.log("Save CustomId format:", format);
    // Здесь можно вызывать API/Store для сохранения
  };

  return (
    <div className="mt-4">
      <label className="block mb-2 font-medium">Custom ID Format</label>
      <input
        type="text"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="border p-1 rounded w-full"
        placeholder="e.g. PREFIX-{sequence}-YYYY"
      />
      <button
        onClick={saveFormat}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default CustomIdTab;
