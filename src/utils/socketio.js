const socketio = require('socket.io');
// redis adapter allows for multiple socket.io servers that act as one
const redisAdapter = require('socket.io-redis');
const sockets = {};

module.exports.init = (server) => {
  const io = socketio.listen(server.server, {
    path: '/io',
    pingInterval: 10000,
    pingTimeout: 5000
  });

  // hook up to redis
  io.adapter(redisAdapter({ host: 'redis-14119.c1.us-central1-2.gce.cloud.redislabs.com', port: 14119, password: 'wM6js9sgfIhN6DsvphjoRCo4cnuS3I9E' }));

  io.on('connection', function(socket) {
    const token = socket.handshake.query.token; // look for token identifier from client
    console.log(`a user (id:${socket.id}) connected`);

    // remember this socket
    sockets[socket.id] = socket;

    socket.on('message', (message) => {
      console.log(message);
    });

    // remove socket
    socket.on('disconnect', (reason) => {
      console.log(`disconnect ${socket.id}`);
      delete sockets[socket.id];
    });
  });
};
