import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

export const connectSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
