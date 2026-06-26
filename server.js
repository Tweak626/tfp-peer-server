const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 9000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => res.send('TFP PeerJS Server is running'));

// PeerJS client path:'/' builds URL: host + '/' + 'peerjs' + '/id'
// So server path must be '/' and it handles /peerjs/* automatically
const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
  proxied: true,
});

app.use('/', peerServer);

peerServer.on('connection', c => console.log(`[${new Date().toISOString()}] + ${c.getId()}`));
peerServer.on('disconnect', c => console.log(`[${new Date().toISOString()}] - ${c.getId()}`));

server.listen(port, () => console.log(`TFP PeerJS running on ${port}`));
