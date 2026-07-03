export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id);

    socket.on('join', (role) => {
      socket.join(role);
      console.log(`${socket.id} a rejoint la salle ${role}`);
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté:', socket.id);
    });
  });
}
