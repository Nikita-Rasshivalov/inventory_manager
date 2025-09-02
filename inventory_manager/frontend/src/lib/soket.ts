import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
