import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useInventorySocket } from "../../hooks/useInventorySocket";
import { useCommentStore } from "../../stores/useCommentsStore";
import { User } from "../../models/models";

interface DiscussionTabProps {
  inventoryId: number;
  currentUser: User;
}

export const DiscussionView = ({
  inventoryId,
  currentUser,
}: DiscussionTabProps) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const { comments, setComments, addComment, clearComments } =
    useCommentStore();

  const { emitNewComment } = useInventorySocket({
    inventoryId,
    onInitialComments: (initialComments) => {
      setComments(initialComments);
      setLoading(false);
    },
    onNewComment: (comment) => addComment(comment),
  });

  useEffect(() => {
    setLoading(true);
    return () => clearComments();
  }, [inventoryId, clearComments]);

  const handleSend = () => {
    if (!newComment.trim()) return;

    emitNewComment(newComment, currentUser.id);
    setNewComment("");
  };

  if (!currentUser.id || loading) {
    return <Loader className="mx-auto my-4 animate-spin" />;
  }

  return (
    <div className="flex flex-col h-full">
      <CommentList
        inventoryId={inventoryId}
        comments={comments}
        currentUser={currentUser}
      />
      <CommentInput
        value={newComment}
        onChange={setNewComment}
        onSend={handleSend}
      />
    </div>
  );
};

export default DiscussionView;
