import { create } from "zustand";
import { Comment } from "../models/models";
import { InventoryService } from "../services/inventoryService";

interface CommentState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  removeComment: (commentId: number) => void;
  clearComments: () => void;
  fetchComments: (inventoryId: number) => Promise<void>;
  deleteComment: (inventoryId: number, commentId: number) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],

  setComments: (comments) => set({ comments }),

  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),

  removeComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((c) => c.id !== commentId),
    })),

  clearComments: () => set({ comments: [] }),

  fetchComments: async (inventoryId) => {
    try {
      const comments = await InventoryService.getComments(inventoryId);
      set({ comments });
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      set({ comments: [] });
    }
  },

  deleteComment: async (inventoryId, commentId) => {
    try {
      await InventoryService.deleteComment(inventoryId, commentId);
      get().removeComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  },
}));
