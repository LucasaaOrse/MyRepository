// services/socket.ts
import { io } from "socket.io-client";

export const socket = io("https://pizzaria-backend-production-bccd.up.railway.app", {
  transports: ["websocket"],
});