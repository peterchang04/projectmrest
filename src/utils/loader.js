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
      routes = routes.concat(require(`../routes/${filename}`));
    }
  });
  return routes;
};
