import { useEffect, useState, useRef } from "react";
import { socket as globalSocket } from "../lib/soket";
import { Like, Comment } from "../models/models";
import { useCommentStore } from "../stores/useCommentsStore";

export interface InventorySocketOptions {
  inventoryId: number;
  onNewComment?: (comment: Comment) => void;
  onInitialComments?: (comments: Comment[]) => void;
  onItemLiked?: (like: Like) => void;
}

export const useInventorySocket = (options: InventorySocketOptions) => {
  const { inventoryId, onNewComment, onInitialComments, onItemLiked } = options;
  const { addComment, setComments, removeComment } = useCommentStore();

  const [connected, setConnected] = useState(false);

  const newCommentRef = useRef(onNewComment);
  const initialCommentsRef = useRef(onInitialComments);
  const itemLikedRef = useRef(onItemLiked);

  useEffect(() => {
    newCommentRef.current = onNewComment;
  }, [onNewComment]);
  useEffect(() => {
    initialCommentsRef.current = onInitialComments;
  }, [onInitialComments]);
  useEffect(() => {
    itemLikedRef.current = onItemLiked;
  }, [onItemLiked]);

  useEffect(() => {
    if (!inventoryId) return;

    if (!globalSocket.connected) {
      globalSocket.connect();
    }

    globalSocket.emit("joinInventory", inventoryId);

    const handleNewComment = (comment: Comment) => {
      addComment(comment);
      newCommentRef.current?.(comment);
    };

    const handleInitialComments = (comments: Comment[]) => {
      setComments(comments);
      initialCommentsRef.current?.(comments);
    };

    const handlePostDeleted = (data: { commentId: number }) => {
      removeComment(data.commentId);
    };

    const handleItemLiked = (like: Like) => itemLikedRef.current?.(like);

    globalSocket.on("newDiscussionPost", handleNewComment);
    globalSocket.on("initialDiscussionPosts", handleInitialComments);
    globalSocket.on("discussionPostDeleted", handlePostDeleted);
    globalSocket.on("itemLiked", handleItemLiked);

    setConnected(true);

    return () => {
      globalSocket.off("newDiscussionPost", handleNewComment);
      globalSocket.off("initialDiscussionPosts", handleInitialComments);
      globalSocket.off("discussionPostDeleted", handlePostDeleted);
      globalSocket.off("itemLiked", handleItemLiked);

      globalSocket.emit("leaveInventory", inventoryId);
      setConnected(false);
    };
  }, [inventoryId, addComment, setComments, removeComment]);

  const emitNewComment = (content: string, userId: number) => {
    if (connected) {
      globalSocket.emit("newDiscussionPost", { inventoryId, content, userId });
    }
  };

  const emitDeleteComment = (commentId: number, userId: number) => {
    if (connected) {
      globalSocket.emit("deleteDiscussionPost", {
        inventoryId,
        commentId,
        userId,
      });
    }
  };

  return {
    socket: connected ? globalSocket : null,
    emitNewComment,
    emitDeleteComment,
  };
};
