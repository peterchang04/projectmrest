require('dotenv').config();

const server = require('./server');
const serverInstance = server.init(process.env.port || process.env.port_default);

// EXPORT FOR TESTING
module.exports = server;
