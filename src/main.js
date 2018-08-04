var restify = require('restify');
var server = restify.createServer();
var loader = require('./utils/loader');

// LOAD MODELS
var models = loader.loadModels();

// LOAD ROUTES
var routes = loader.loadRoutes(server, models);

// ADD ROUTES TO SERVER
routes.forEach((route) => {
  server[route.method.toLowerCase()](route.path, models[route.model][route.func]);
});

// START SERVER
server.listen(51337, () => {
  console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;
