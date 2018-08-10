var expect = require('chai').expect;
var chai = require('chai');
var server = require('../src/server');

// GLOBAL TEST SETUP
before('setting up server', async () => {
  console.log('main.test.js SETUP');
  try {
    await server.init(51338); // mocha shouldn't use 51337 which is dev server
  } catch (e) {
    console.error('main.test.js setting up server', e);
    return;
  }
});

// GLOBAL TEST TEARDOWN
after('tearing down server', () => {
  console.log('main.test.js TEARDOWN');
  server.close();
  expect(1).to.equal(1);
});
