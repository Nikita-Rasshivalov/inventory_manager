import { TopInventory } from "../../models/models";
import { Loader2 } from "lucide-react";

interface Props {
  inventories: TopInventory[];
  loading: boolean;
  onClick: (id: number, title: string) => void;
}

const TopInventoriesTable = ({ inventories, loading, onClick }: Props) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Top 5 Popular Inventories
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      ) : inventories.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No inventories found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Created by</th>
                <th className="px-4 py-3">Elements</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => onClick(inv.id, inv.title)}
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {inv.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {inv.owner?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {inv._count?.items ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopInventoriesTable;
