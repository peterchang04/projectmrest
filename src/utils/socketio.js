const socketio = require('socket.io');
// redis adapter allows for multiple socket.io servers that act as one
const redisAdapter = require('socket.io-redis');
const signal = require('../models/signal');
let io = null;
let serverIP = null;

module.exports.init = (server) => {
  serverIP = server.ip;
  io = socketio.listen(server.server, {
    path: '/io',
    pingInterval: 10000,
    pingTimeout: 5000
  });

  // hook up to redis - support for multiple servers
  io.adapter(redisAdapter({
    host: process.env.socketioRedisEndpoint || process.env.socketioRedisEndpoint_default,
    port: process.env.socketioRedisPort || process.env.socketioRedisPort_default,
    password: process.env.socketioRedisPassword || process.env.socketioRedisPassword_default
  }));

  io.origins('*:*'); // CORS

  io.on('connection', function(socket) {
    console.log(`a websocket user (id:${socket.id}) connected`);

    socket.on('message', (message) => {
      console.log('message received', message);
      if (message.type in messageHandlers) {
        messageHandlers[message.type](message, socket);
      }
    });

    socket.on('disconnect', async (reason) => {
      console.log(`disconnect ${socket.id}`);
    });
  });
};

const messageHandlers = {
  "handshake-client": async (message, socket) => {
    // this should be 1st message sent from client to server, with their preferred room and identifier
    // "preferred" because if 2 tabs open, both cannot have same identifier

    // get the appropriate identifier (attempt to get preferred if avail, or get a new one)
    const args = {};
    if (message.preferredIdentifier) args.preferredIdentifier = message.preferredIdentifier;
    const identifierReq = await signal.getIdentifier(args);
    const identifier = identifierReq[0].identifier;
    const iceServers = await signal._getIceServers();

    // always join own room by default. This is the mechanism other users find you
    socket.join(identifier);

    // get all this data back to the caller
    socket.send({
      type: 'handshake-server',
      serverIP,
      socketId: socket.id,
      identifier,
      iceServers,
      room: identifier
    });
  },
  "offer-relay": async (message, socket) => {
    // check which sockets are in the requested room (identifier)
    let clientsInRoom = {};
    if (io.sockets.adapter.rooms[message.recipientIdentifier]) {
      clientsInRoom = io.sockets.adapter.rooms[message.recipientIdentifier].sockets;
    }

    // can't join rooms with nobody in it
    if (Object.keys(clientsInRoom).length === 0) {
      return socket.send({ type: 'offer-noSuchIdentifier', serverIP });
    }

    // can't join own room
    if (message.recipientIdentifier === message.senderIdentifier) {
      return socket.send({ type: 'offer-denyOwnIdentifier', serverIP });
    }

    socket.to(message.recipientIdentifier).send({
      type: 'offer',
      serverIP,
      senderIdentifier: message.senderIdentifier,
      recipientIdentifier: message.recipientIdentifier,
      desc: message.desc
    });
  },
  "answer-relay": (message, socket) => {
    socket.to(message.recipientIdentifier).send({
      type: 'answer',
      serverIP,
      senderIdentifier: message.senderIdentifier,
      recipientIdentifier: message.recipientIdentifier,
      desc: message.desc
    });
  },
  "candidate-relay": (message, socket) => {
    socket.to(message.recipientIdentifier).send({
      type: 'candidate',
      serverIP,
      senderIdentifier: message.senderIdentifier,
      recipientIdentifier: message.recipientIdentifier,
      candidate: message.candidate
    });
  }
};
