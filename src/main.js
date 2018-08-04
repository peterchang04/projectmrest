var restify = require('restify');
var server = restify.createServer();
var loader = require('./utils/loader');
var mdb = require('./utils/mdb');

// FIRST, CONNECT TO DATASOURCES
mdb.connect()
.then(() => console.log('MongoDB connected'))
.then(() => bootApp())
.catch((e) => {
  console.error(e);
  // hard exit on db connection error
  process.exit(1);
})

function bootApp() {
  // GLOBAL PRE-REQUEST HANDLER
  server.pre((req, res, next) => {
    console.log('pre', res);
    next();
  });

  // GLOBAL POST-REQUEST HANDLER
  server.use((req, res, next) => {
    console.log('use', res);
    next();
  });

  // LOAD MODELS
  var models = loader.loadModels();

  // LOAD ROUTES
  var routes = loader.loadRoutes(server, models);

  // ADD ROUTES TO SERVER
  loader.wireRoutesToModels(routes, models, server);



  // GLO

  // START SERVER
  server.listen(51337, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
}

// EXPORT FOR TESTING
module.exports = server;
