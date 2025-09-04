import { useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { Comment, User } from "../../models/models";

import { Link } from "react-router-dom";

interface CommentListProps {
  comments: Comment[];
  currentUser: User;
  inventoryId: number;
  onDelete?: (commentId: number) => void;
}

const CommentList = ({ comments, currentUser, onDelete }: CommentListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 bg-gray-50 border border-gray-300 rounded-md shadow-inner"
      style={{ maxHeight: "400px" }}
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
                  <Link
                    to={
                      c.userId === currentUser.id
                        ? "/profile"
                        : `/users/${c.userId}`
                    }
                  >
                    <img
                      src={c.user?.imageUrl || "/default-avatar.png"}
                      alt={c.user?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center w-full">
                    <Link
                      to={
                        c.userId === currentUser.id
                          ? "/profile"
                          : `/users/${c.userId}`
                      }
                      className="font-semibold text-gray-800 text-xs hover:underline flex-1 text-left"
                    >
                      {c.user?.name || "Unknown"}
                    </Link>
                    <span className="text-[10px] text-gray-500 text-right">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-1 text-gray-700 break-words break-all overflow-wrap-anywhere">
                    {c.content}
                  </div>
                </div>
                {canDelete && (
                  <button
                    onClick={() => onDelete?.(c.id)}
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
