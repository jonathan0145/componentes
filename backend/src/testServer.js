const { startServer } = require('./index');

async function createTestServer() {
  // startServer returns a Promise that resolves to an http.Server instance
  const server = await startServer(0); // 0 => puerto aleatorio
  return server;
}

module.exports = { createTestServer };
