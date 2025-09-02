import { Server, Socket } from "socket.io";
import { handleInventoryEvents } from "./inventorySocket.ts";

export default function registerSocketHandlers(socket: Socket, io: Server) {
  console.log(`Socket connected: ${socket.id}`);

  handleInventoryEvents(socket, io);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
}
