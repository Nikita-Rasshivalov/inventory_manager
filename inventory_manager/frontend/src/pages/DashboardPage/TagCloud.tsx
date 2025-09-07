import React from "react";
import { useNavigate } from "react-router-dom";
import { useTags } from "../../hooks/useTags";
import { Loader2 } from "lucide-react";

interface Props {
  limit?: number;
}

const TagCloud: React.FC<Props> = ({ limit = 30 }) => {
  const { data: tags, isLoading, error } = useTags();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin w-5 h-5 text-gray-500 dark:text-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 py-4 text-sm">
        Tags error
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="text-gray-400 dark:text-gray-300 py-4 text-sm">
        Tags not found
      </div>
    );
  }

  const topTags = tags.slice(0, limit);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-[20vh] mt-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        {topTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => navigate(`/search?tag=${tag.name}`)}
            className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 
                       text-gray-700 dark:text-gray-200 hover:bg-blue-500 
                       hover:text-white transition"
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagCloud;
