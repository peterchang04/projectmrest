// loads all files from /src/models
module.exports.loadModels = function loadModels() {
  var models = {};
  // solve for path to /src/model
  var normalizedPath = __dirname;
  normalizedPath = normalizedPath.replace('/utils','/models');

  // load contents of folder into models struct
  require('fs').readdirSync(normalizedPath).forEach((file) => {
    if (file.substring(file.length - 3, file.length) === '.js') {
      var filename = file.replace('.js', '');
      models[filename] = require(`../models/${filename}`);
    }
  });
  return models;
};

// loads all routes from /src/routes
module.exports.loadRoutes = function loadRoutes(server, models) {
  var routes = [];
  // solve for path to /src/route
  var normalizedPath = __dirname;
  normalizedPath = normalizedPath.replace('/utils','/routes');

  // load contents of folder into routes array
  require('fs').readdirSync(normalizedPath).forEach((file) => {
    if (file.substring(file.length - 3, file.length) === '.js') {
      var filename = file.replace('.js', '');
      var fileRoutes = require(`../routes/${filename}`);
      // do some checks - must be array
      if (!Array.isArray(fileRoutes)) {
        throw `Failed to load route [${filename}] must export as array. was [${typeof fileRoutes}]`;
      }
      // do some checks, individual routes must be named right
      fileRoutes.forEach(route => {
        if (!route.method || !route.path || !route.model || !route.func) {
          console.error('route:', route);
          throw "route must be in format { method, path, model, func }";
        }
      });
      routes = routes.concat(require(`../routes/${filename}`));
    }
  });
  return routes;
};

// wires everything together
module.exports.wireRoutesToModels = function wireRoutesToModels(routes, models, server) {
  routes.forEach((route) => {
    if (!models[route.model]) {
      throw `Failed to wire [${route.path}] to [/src/models/${route.model}]`;
    }
    if (!models[route.model][route.func]) {
      throw `Failed to wire [${route.path}] to [/src/models/${route.model}.${route.func}]`;
    }
    server[route.method.toLowerCase()](route.path, models[route.model][route.func]);
  });
};
