import { useEffect, useState, useRef } from "react";
import { socket as globalSocket } from "../lib/soket";
import { Like } from "../models/models";

interface ItemLikesSocketOptions {
  itemId: number;
  onInitialLikes?: (likes: Like[]) => void;
  onItemLiked?: (likes: Like[]) => void;
}

export const useItemLikesSocket = (options: ItemLikesSocketOptions) => {
  const { itemId, onInitialLikes, onItemLiked } = options;
  const [connected, setConnected] = useState(false);

  const initialLikesRef = useRef(onInitialLikes);
  const itemLikedRef = useRef(onItemLiked);

  useEffect(() => {
    initialLikesRef.current = onInitialLikes;
  }, [onInitialLikes]);

  useEffect(() => {
    itemLikedRef.current = onItemLiked;
  }, [onItemLiked]);

  useEffect(() => {
    if (!itemId) return;

    if (!globalSocket.connected) {
      globalSocket.connect();
    }

    globalSocket.emit("joinItem", itemId);

    const handleInitialLikes = (data: { itemId: number; likes: Like[] }) => {
      if (data.itemId === itemId) {
        initialLikesRef.current?.(data.likes);
      }
    };

    const handleItemLiked = (data: { itemId: number; likes: Like[] }) => {
      if (data.itemId === itemId) {
        itemLikedRef.current?.(data.likes);
      }
    };

    globalSocket.on("initialItemLikes", handleInitialLikes);
    globalSocket.on("itemLiked", handleItemLiked);

    setConnected(true);

    return () => {
      globalSocket.off("initialItemLikes", handleInitialLikes);
      globalSocket.off("itemLiked", handleItemLiked);
      setConnected(false);
    };
  }, [itemId]);

  const toggleLike = (userId: number) => {
    if (connected) {
      globalSocket.emit("toggleLikeItem", { itemId, userId });
    }
  };

  return { toggleLike };
};
