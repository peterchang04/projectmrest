var restify = require('restify');
var server = restify.createServer();

// ROUTES
server.get('/v1/health', health);
server.get('/v1/crash', crash);
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

// START SERVER
server.listen(51337, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// FUNCTIONS
function crash(req, res, next) { // test nodemon restart
  setTimeout(function () {
    throw new Error('we crashing');
  }, 10);
}

function health(req, res, next) {
  res.send('i healthy');
}

// function respond(req, res, next) {
//   res.send('hello ' + req.params.name);
//   next();
// }

module.exports = server;
