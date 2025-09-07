import { Loader2 } from "lucide-react";
import { TopInventory } from "../../models/models";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  inventories?: TopInventory[];
  loading: boolean;
  onClick: (id: number, title: string) => void;
}

const TopInventoriesTable = ({ inventories = [], loading, onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 h-[50vh] shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
        {t("top_inventories")}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500 dark:text-gray-200" />
          <span className="ml-2 text-gray-500 dark:text-gray-200">
            {t("loading")}
          </span>
        </div>
      ) : inventories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-400 dark:text-gray-300 mb-2">
            {t("no_inventories_found")}
          </p>
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto h-[40vh]">
          <table className="w-full min-w-[600px] text-sm text-left border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-3 py-2">{t("title")}</th>
                <th className="px-3 py-2">{t("created_by")}</th>
                <th className="px-3 py-2">{t("elements")}</th>
                <th className="px-3 py-2">{t("category")}</th>
                <th className="px-3 py-2">{t("tags")}</th>
                <th className="px-3 py-2">{t("description")}</th>
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
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100">
                    {inv.category?.name || "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100">
                    {inv.tags?.length
                      ? inv.tags.map((t) => <div key={t.id}>{t.name}</div>)
                      : "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-100 max-w-xs">
                    {inv.description ? (
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {inv.description}
                      </Markdown>
                    ) : (
                      "—"
                    )}
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
