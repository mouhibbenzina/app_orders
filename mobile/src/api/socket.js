import { io } from 'socket.io-client';

const SOCKET_URL = 'http://10.0.2.2:3000';

let socket = null;

export function connectSocket(role) {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL);
  socket.on('connect', () => {
    socket.emit('join', role);
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
