var restify = require('restify');
var server = restify.createServer();
var loader = require('./utils/loader');
var wiring = require('./utils/wiring');
var mdb = require('./utils/mdb');

// server always UTC
process.env.TZ = 'UTC';

// catch unhandled promises and async
process.on('unhandledRejection', (reason, p) => { throw reason });

server.use(restify.plugins.queryParser({ mapParams: true })); // parse url params
server.use(restify.plugins.bodyParser({ mapParams: true })); // parse JSON body

function init(port = 51337) {
  return new Promise(async (resolve, reject) => {
    try {
      // FIRST, CONNECT TO DATASOURCES
      await mdb.init();

      // GLOBAL PRE-REQUEST HANDLER
      server.pre((req, res, next) => {
        // console.log('pre', res);
        next();
      });

      // GLOBAL POST-REQUEST HANDLER
      server.use((req, res, next) => {
        // console.log('use', res);
        next();
      });

      // LOAD MODELS
      var models = loader.loadModels();

      // LOAD ROUTES
      var routes = loader.loadRoutes(server, models);

      // ADD ROUTES TO SERVER
      wiring.wireRoutesToModels(routes, models, server);

      // START SERVER
      server.listen(port, () => {
        console.log('%s listening at %s', server.name, server.url);
        server.ready = true;
      });

      resolve(server); // resolve promise. Returns instance of server
    } catch (e) {
      console.error(e);
      reject();
    }
  });
}

// EXPORT FOR TESTING
module.exports.init = init;
module.exports.server = server;
module.exports.close = () => { // method for shutting down server
  mdb.close();
  server.close();
};