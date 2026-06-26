const { PeerServer } = require('peer');

const port = process.env.PORT || 9000;

const server = PeerServer({
  port: port,
  path: '/',
  allow_discovery: true,
  proxied: true,
  cors: {
    origin: [
      'https://thefreedomphilosophy.net',
      'https://www.thefreedomphilosophy.net',
      '*'
    ]
  }
});

server.on('connection', client => {
  console.log(`[${new Date().toISOString()}] Client connected: ${client.getId()}`);
});

server.on('disconnect', client => {
  console.log(`[${new Date().toISOString()}] Client disconnected: ${client.getId()}`);
});

console.log(`TFP PeerJS Server running on port ${port}`);
