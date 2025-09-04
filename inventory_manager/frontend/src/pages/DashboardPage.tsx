import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Inventory } from "../models/models";

const DashboardPage = () => {
  const navigate = useNavigate();
  const popularInventories: any = [];
  const latestInventories: any = [];

  const loading = true;
  const handleClick = (id: number, title: string) => {
    navigate(`/inventory/${id}/items`, { state: { inventoryTitle: title } });
  };

  const renderTable = (
    title: string,
    inventories: Inventory[],
    columns: { key: string; label: string; render: (inv: Inventory) => any }[]
  ) => (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <table className="w-full text-sm text-left border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventories.map((inv) => (
              <tr
                key={inv.id}
                className="border-t hover:bg-gray-50 cursor-pointer transition"
                onClick={() => handleClick(inv.id, inv.title)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 text-gray-700">
                    {col.render(inv)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTable("Latest Inventories", latestInventories, [
          { key: "title", label: "Title", render: (i) => i.title },
          { key: "owner", label: "Owner", render: (i) => i.owner?.name || "—" },
          {
            key: "desc",
            label: "Created at",
            render: (i) => i.createdAt || "—",
          },
        ])}

        {renderTable("Top 5 Popular Inventories", popularInventories, [
          { key: "title", label: "Title", render: (i) => i.title },
          { key: "owner", label: "Owner", render: (i) => i.owner?.name || "—" },
          {
            key: "elements",
            label: "Elements",
            render: (i) => i.items.length || 0,
          },
        ])}
      </div>
    </>
  );
};

export default DashboardPage;
