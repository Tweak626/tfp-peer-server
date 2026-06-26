const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 9000;

// Health check — Railway uses this to confirm the app is running
app.get('/', (req, res) => {
  res.send('TFP PeerJS Server is running');
});

// PeerJS server mounted at /peerjs
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',
  allow_discovery: true,
  proxied: true,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', client => {
  console.log(`[${new Date().toISOString()}] Connected: ${client.getId()}`);
});

peerServer.on('disconnect', client => {
  console.log(`[${new Date().toISOString()}] Disconnected: ${client.getId()}`);
});

server.listen(port, () => {
  console.log(`TFP PeerJS Server running on port ${port}`);
});
