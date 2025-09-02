import { useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { Comment, User } from "../../models/models";
import { useCommentStore } from "../../stores/useCommentsStore";

interface CommentListProps {
  comments: Comment[];
  currentUser: User;
  inventoryId: number;
}

const CommentList = ({
  inventoryId,
  comments,
  currentUser,
}: CommentListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { deleteComment } = useCommentStore();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [comments]);

  const handleDelete = (commentId: number) => {
    deleteComment(inventoryId, commentId);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50 shadow-inner max-h-[400px] sm:max-h-[600px]"
    >
      {comments.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No comments yet. Be the first!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const canDelete =
              c.userId === currentUser.id || currentUser.role === "ADMIN";

            return (
              <div
                key={c.id}
                className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
                    {c.user?.name?.[0] || "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {c.user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-700 break-words break-all overflow-wrap-anywhere">
                    {c.content}
                  </div>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="ml-2 p-1 text-gray-500 hover:text-red-500"
                    title="Delete comment"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentList;
