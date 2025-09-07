import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSearchInventories } from "../hooks/useSearchInventories";
import Header from "../components/layout/Header";

const SearchPage = () => {
  const [params] = useSearchParams();
  const tag = params.get("tag") ?? "";
  const navigate = useNavigate();

  const { data: inventories, isLoading } = useSearchInventories(tag);

  if (!tag) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-200">
        Please specify a tag to search.
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6 dark:bg-gray-900 ">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Inventories with tag: <span className="text-blue-500">#{tag}</span>
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500 dark:text-gray-200" />
          </div>
        ) : inventories && inventories.length > 0 ? (
          <div className="grid gap-4">
            {inventories.map((inv) => (
              <div
                key={inv.id}
                onClick={() =>
                  navigate(`/inventory/${inv.id}/items`, {
                    state: { inventoryTitle: inv.title },
                  })
                }
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {inv.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {inv.owner?.name || "—"} • {inv.category?.name || "—"}
                </p>
                {inv.description && (
                  <div className="mt-2 text-gray-700 dark:text-gray-200 text-sm line-clamp-3">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {inv.description}
                    </Markdown>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {inv.tags?.map((t, idx) => (
                    <span
                      key={`${inv.id}-${t.id ?? idx}`}
                      className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            Nothing found for tag "{tag}"
          </p>
        )}
      </div>
    </>
  );
};

export default SearchPage;
