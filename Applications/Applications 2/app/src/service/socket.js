import socketIOClient from "socket.io-client";

const SERVER_URL = "http://127.0.0.1:3001";
export const socket = socketIOClient(SERVER_URL);