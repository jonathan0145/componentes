let io = null;

exports.init = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  return io;
};

exports.getIo = () => {
  if (!io) throw new Error('Socket.io no inicializado. Llama init(server) primero.');
  return io;
};

exports.close = async () => {
  if (io) {
    try {
      await io.close();
      io = null;
    } catch (e) {
      console.warn('Error closing socket.io:', e.message);
    }
  }
};
