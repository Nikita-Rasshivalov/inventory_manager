import { Loader2 } from "lucide-react";
import { TopInventory } from "../../models/models";

interface Props {
  inventories: TopInventory[];
  loading: boolean;
  onClick: (id: number, title: string) => void;
}

const TopInventoriesTable = ({ inventories, loading, onClick }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800  h-[50vh] shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Top 5 Popular Inventories
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500 dark:text-gray-200" />
        </div>
      ) : inventories.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-300">No inventories found</p>
      ) : (
        <div className="overflow-x-auto h-[40vh]">
          <table className="w-full min-w-[500px] text-sm text-left border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Created by</th>
                <th className="px-3 py-2">Elements</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => onClick(inv.id, inv.title)}
                >
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100">
                    {inv.title}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100">
                    {inv.owner?.name || "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100">
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
