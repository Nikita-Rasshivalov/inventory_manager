import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function handleInventoryEvents(socket: Socket, io: Server) {
  socket.on("joinInventory", async (inventoryId: number) => {
    socket.join(`inventory_${inventoryId}`);
    console.log(`Socket ${socket.id} joined inventory ${inventoryId}`);

    try {
      const comments = await prisma.comment.findMany({
        where: { inventoryId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      });

      socket.emit(
        "initialDiscussionPosts",
        comments.map((c) => ({
          id: c.id,
          inventoryId: c.inventoryId,
          userId: c.userId,
          userName: c.user.name,
          content: c.content,
          createdAt: c.createdAt,
        }))
      );
    } catch (err) {
      console.error("Failed to load initial discussion posts:", err);
      socket.emit("error", { message: "Failed to load discussion posts" });
    }
  });

  socket.on(
    "newDiscussionPost",
    async (data: { inventoryId: number; userId: number; content: string }) => {
      try {
        const post = await prisma.comment.create({
          data: {
            inventoryId: data.inventoryId,
            userId: data.userId,
            content: data.content,
          },
          include: {
            user: { select: { id: true, name: true } },
          },
        });

        io.to(`inventory_${data.inventoryId}`).emit("newDiscussionPost", {
          id: post.id,
          inventoryId: post.inventoryId,
          userId: post.userId,
          userName: post.user.name,
          content: post.content,
          createdAt: post.createdAt,
        });
      } catch (err) {
        console.error("Failed to save discussion post:", err);
        socket.emit("error", { message: "Failed to save discussion post" });
      }
    }
  );

  socket.on("joinItem", async (itemId: number) => {
    socket.join(`item_${itemId}`);
    console.log(`Socket ${socket.id} joined item ${itemId}`);

    try {
      const likes = await prisma.like.findMany({
        where: { itemId },
      });

      socket.emit("initialItemLikes", {
        itemId,
        likes: likes.map((like) => ({
          id: like.id,
          itemId: like.itemId,
          userId: like.userId,
          createdAt: like.createdAt,
        })),
      });
    } catch (err) {
      console.error("Failed to load initial likes:", err);
      socket.emit("error", { message: "Failed to load likes" });
    }
  });

  socket.on(
    "toggleLikeItem",
    async (data: { itemId: number; userId: number }) => {
      try {
        const existingLike = await prisma.like.findFirst({
          where: { itemId: data.itemId, userId: data.userId },
        });

        if (existingLike) {
          await prisma.like.delete({ where: { id: existingLike.id } });
        } else {
          await prisma.like.upsert({
            where: {
              itemId_userId: { itemId: data.itemId, userId: data.userId },
            },
            create: { itemId: data.itemId, userId: data.userId },
            update: {},
          });
        }

        const likes = await prisma.like.findMany({
          where: { itemId: data.itemId },
        });

        io.to(`item_${data.itemId}`).emit("itemLiked", {
          itemId: data.itemId,
          likes: likes.map((like) => ({
            id: like.id,
            itemId: like.itemId,
            userId: like.userId,
            createdAt: like.createdAt,
          })),
        });
      } catch (err) {
        console.error("Failed to toggle like:", err);
        socket.emit("error", { message: "Failed to toggle like" });
      }
    }
  );
}
