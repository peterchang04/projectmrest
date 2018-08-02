var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function health(req, res, next) {
  res.send('healthy2');
  process.exit();
}

var server = restify.createServer();
server.get('/v1/health', health);

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(51337, function() {
  console.log('%s listening at %s', server.name, server.url);
});
