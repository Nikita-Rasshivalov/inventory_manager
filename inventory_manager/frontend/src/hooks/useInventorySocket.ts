import { useEffect, useState, useRef } from "react";
import { socket as globalSocket } from "../lib/soket";
import { Like, Comment } from "../models/models";

export interface InventorySocketOptions {
  inventoryId: number;
  onNewComment?: (comment: Comment) => void;
  onInitialComments?: (comments: Comment[]) => void;
  onItemLiked?: (like: Like) => void;
}

export const useInventorySocket = (options: InventorySocketOptions) => {
  const { inventoryId, onNewComment, onInitialComments, onItemLiked } = options;
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
    const handleNewComment = (comment: Comment) =>
      newCommentRef.current?.(comment);
    const handleInitialComments = (comments: Comment[]) =>
      initialCommentsRef.current?.(comments);
    const handleItemLiked = (like: Like) => itemLikedRef.current?.(like);

    globalSocket.on("newDiscussionPost", handleNewComment);
    globalSocket.on("initialDiscussionPosts", handleInitialComments);
    globalSocket.on("itemLiked", handleItemLiked);

    setConnected(true);

    return () => {
      globalSocket.off("newDiscussionPost", handleNewComment);
      globalSocket.off("initialDiscussionPosts", handleInitialComments);
      globalSocket.off("itemLiked", handleItemLiked);

      globalSocket.emit("leaveInventory", inventoryId);
      setConnected(false);
    };
  }, [inventoryId]);

  const emitNewComment = (content: string, userId: number) => {
    if (connected) {
      globalSocket.emit("newDiscussionPost", { inventoryId, content, userId });
    }
  };

  const emitLikeItem = (itemId: number, userId: number) => {
    if (connected) {
      globalSocket.emit("likeItem", { itemId, userId });
    }
  };

  return {
    socket: connected ? globalSocket : null,
    emitNewComment,
    emitLikeItem,
  };
};
