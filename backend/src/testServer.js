const { startServer } = require('./index');
const { close: closeIo } = require('./services/socketProvider');

async function createTestServer() {
  // startServer now returns { server, io }
  const { server } = await startServer(0); // 0 => puerto aleatorio

  return {
    server,
    close: async () => {
      // Cerrar http server
      await new Promise((resolve) => server.close(resolve));
      // Cerrar socket.io si fue inicializado
      try {
        await closeIo();
      } catch (e) {
        // ignore
      }
    }
  };
}

module.exports = { createTestServer };
