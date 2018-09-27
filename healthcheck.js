// Dockerfile healthcheck hits this file to check server. Alpine image has no curl
require('dotenv').config();
const http = require('http');

const options = {
  host: 'localhost',
  port: `${process.env.port || process.env.port_default}`,
  timeout: 2000,
  path: '/v1/health'
};

const request = http.request(options, (res) => {
  console.log(`HEALTHCHECK STATUS: ${res.statusCode} ${typeof res.statusCode}`);
  if (res.statusCode == 200) {
    console.log('healthy');
    process.exit(0);
  } else {
    console.log('unhealthy');
    process.exit(1);
  }
});

request.on('error', function(err) {
  console.log('HEALTHCHECK ERROR');
  process.exit(1);
});

request.end();
