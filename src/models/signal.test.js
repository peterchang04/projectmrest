var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server');
chai.use(chaiHttp);

describe('[DELETE/_v1/signal/identifier/xyz-test] make sure it does not exist', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .delete('/_v1/signal/identifier/xyz-test')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('DELETE/_v1/signal/identifier/:identifier');
      done();
    });
  }).timeout(1000);
});

describe('[GET/_v1/signal/identifier/xyz-test] check for identifier (!exist)', function() {
  it('should return 200 { healthy: true }', (done) => {
    chai.request(server.server)
    .get('/_v1/signal/identifier/xyz-test')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('GET/_v1/signal/identifier/:identifier');
      expect(res.body.data.length).to.equal(0);
      done();
    });
  }).timeout(1000);
});

describe('[POST/_v1/signal/identifier] generate an identifier', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .post('/_v1/signal/identifier')
    .set('content-type', 'application/json')
    .send({ identifier: "xyz-test" })
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('POST/_v1/signal/identifier');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].identifier).to.equal('xyz-test');
      done();
    });
  }).timeout(1000);
});

describe('[GET/_v1/signal/identifier/xyz-test] check for identifier (exist!)', function() {
  it('should return 200 { healthy: true }', (done) => {
    chai.request(server.server)
    .get('/_v1/signal/identifier/xyz-test')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('GET/_v1/signal/identifier/:identifier');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].identifier).to.equal('xyz-test');
      done();
    });
  }).timeout(1000);
});

describe('[POST/_v1/signal/identifier] fail unique constraint', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .post('/_v1/signal/identifier')
    .set('content-type', 'application/json')
    .send({ identifier: "xyz-test" })
    .end((err, res) => {
      expect(res.status).to.equal(500);
      expect(res.body.target).to.equal('POST/_v1/signal/identifier');
      done();
    });
  }).timeout(1000);
});

describe('[DELETE/_v1/signal/identifier/xyz-test]', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .delete('/_v1/signal/identifier/xyz-test')
    .set('content-type', 'application/json')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('DELETE/_v1/signal/identifier/:identifier');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].identifier).to.equal('xyz-test');
      expect(res.body.data[0].deleted).to.equal(true);
      done();
    });
  }).timeout(1000);
});

describe('[POST/_v1/signal/identifier/generate] OK', function() {
  // passing in randomMin=1 randomMax=1 means all permutations used up and will fail
  it('checks out', (done) => {
    chai.request(server.server)
    .post('/_v1/signal/identifier/generate')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('POST/_v1/signal/identifier/generate');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].identifier.length).to.be.above(0);
      done();
    });
  }).timeout(1000);
});

let rememberIdentifier = null;
describe('[GET/v1/signal/identifier] get a new random identifier', function() {
  // passing in randomMin=1 randomMax=1 means all permutations used up and will fail
  it('checks out', (done) => {
    chai.request(server.server)
    .get('/v1/signal/identifier')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('GET/v1/signal/identifier');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].identifier.length).to.be.above(0);
      rememberIdentifier = res.body.data[0].identifier;
      done();
    });
  }).timeout(1000);
});

describe('[DELETE/_v1/signal/identifier/remember] cleanup', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .delete(`/_v1/signal/identifier/${rememberIdentifier}`)
    .set('content-type', 'application/json')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('DELETE/_v1/signal/identifier/:identifier');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].deleted).to.equal(true);
      done();
    });
  }).timeout(1000);
});

describe('[POST/_v1/signal/setIndexes]', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .post('/_v1/signal/setIndexes')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('POST/_v1/signal/setIndexes');
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].collection).to.equal('identifier');
      expect(res.body.data[0].unique).to.equal(true);
      done();
    });
  }).timeout(1000);
});

describe('[GET/_v1/signal/ice]', function() {
  it('checks out', (done) => {
    chai.request(server.server)
    .get('/_v1/signal/ice')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal('GET/_v1/signal/ice');
      expect(res.body.data.length).to.be.above(0);

      done();
    });
  }).timeout(1000);
});

// SETUP + TEARDOWN - REQUIRED FOR EVERY HTTP TEST FILE
before('setting up server', async () => {
  try {
    await server.init(51338); // mocha shouldn't use 51337 which is dev server
  } catch (e) {
    console.error('error setting up server', e);
    return;
  }
});
after('tearing down server', () => {
  server.close();
});
