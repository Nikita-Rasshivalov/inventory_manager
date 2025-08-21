import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInventoryStore } from "../../stores/useInventoryStore";
import Toolbar from "../../components/layout/Toolbar";
import { InventoryRow } from "./InventoryRow";
import GenericModal from "../../components/layout/Modal";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const InventoryPage = () => {
  const { inventories, getAll, create, delete: remove } = useInventoryStore();
  const { user } = useAuthProvider();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAll().catch(() => toast.error("Failed to load inventories"));
  }, [getAll]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (!selectedIds.length) return;
    try {
      const message = await remove(selectedIds);
      setSelectedIds([]);
      toast.success(message);
    } catch (err: any) {
      console.error("Failed to delete inventories:", err.message || err);
      toast.error(err.message || "Failed to delete inventories");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? inventories.map((i) => i.id) : []);
  };

  const handleCreate = async (values: Record<string, string>) => {
    if (!user) return;
    const title = values["title"];
    if (!title) return;

    try {
      await create({ title, ownerId: user.id });
      setIsModalOpen(false);
      toast.success("Inventory created successfully");
    } catch (err: any) {
      console.error("Failed to create inventory:", err.message || err);
      toast.error(err.message || "Failed to create inventory");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Inventory</h1>

      <Toolbar
        selectedCount={selectedIds.length}
        totalCount={inventories.length}
        onDelete={handleDelete}
        onSelectAll={handleSelectAll}
        onCreate={() => setIsModalOpen(true)}
      />

      <div className="divide-y divide-gray-200 border rounded-lg">
        {inventories.map((inv) => (
          <InventoryRow
            key={inv.id}
            inv={inv}
            selected={selectedIds.includes(inv.id)}
            toggleSelect={toggleSelect}
          />
        ))}
      </div>

      {isModalOpen && (
        <GenericModal
          title="Create Inventory"
          fields={[{ name: "title", label: "Title" }]}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </main>
  );
};

export default InventoryPage;
