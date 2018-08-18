const asyncMiddleware = require('./asyncMiddleware');
const param = require('./param');
const dns = require('dns'); // to solve for server ip
const os = require('os'); // to solve for server ip

// solve for host ip
var ip = '';
dns.lookup(os.hostname(), function(err, add, fam) {
  ip = add;
});

// wires everything together
module.exports.wireRoutesToModels = (routes, models, server) => {
  routes.forEach((route) => {
    if (!models[route.model]) {
      throw `Failed to wire [${route.path}] to [/src/models/${route.model}]`;
    }
    if (!models[route.model][route.func]) {
      throw `Failed to wire [${route.path}] to [/src/models/${route.model}.${route.func}]`;
    }

    // wrap the model function in a async await container
    const wrappedFunction = asyncMiddleware(async (req, res, next) => {
      const envelope = {
        params_RAW: req.params,
        serverIP: ip,
        target: `${req.route.method}${req.route.path}`
      };

      // end health check early
      if (req.route && req.route.method === 'GET' && req.route.path === '/v1/health') {
        envelope.healthy = true;
        res.send(200, envelope);
        return next();
      } else {
        console.log('incoming request:', envelope.serverIP, envelope.target, JSON.stringify(req.params));
      }

      let statusCode = 200;
      try {
        const errors = [];
        envelope.params = param.sanitizeParams(route.params, req.params, errors /* pass as reference so sanitize can populate */);

        // add error messages to envelope
        if (errors.length) {
          envelope.errorMessages = errors;
          throw new Error('Invalid Parameters');
        }

        // attach result from model
        envelope.data = await models[route.model][route.func](envelope.params);
      } catch (e) {
        envelope.error = true;
        console.error('wiring.wireRoutesToModels caught error: ', e); // display error in console
        // add error message to envelope
        if (e.message) {
          if (!envelope.errorMessages) {
            envelope.errorMessages = [];
          }
          envelope.errorMessages.unshift(e.message);
        }
        statusCode = 500;
      }
      res.send(statusCode, envelope);
      next();
    });

    let serverMethod = route.method.toLowerCase();
    // exception for Delete
    if (serverMethod === 'delete') serverMethod = 'del'; // server.delete doesn't work, but server.post, server.put does :(
    server[serverMethod](route.path, wrappedFunction);
  });
};
