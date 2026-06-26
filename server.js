const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

// CORS — must be first
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/', (req, res) => res.send('TFP PeerJS Server is running'));

// PeerJS — path:'/' means client hits /peerjs/id correctly
// PeerJS URL formula: host + path + key('peerjs') + '/id'
// With path='/': railway.app/ + peerjs + /id = railway.app/peerjs/id ✓
const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
  proxied: true,
});

app.use('/', peerServer);

peerServer.on('connection', client => {
  console.log(`[${new Date().toISOString()}] Connected: ${client.getId()}`);
});
peerServer.on('disconnect', client => {
  console.log(`[${new Date().toISOString()}] Disconnected: ${client.getId()}`);
});

server.listen(port, () => {
  console.log(`TFP PeerJS Server running on port ${port}`);
});
