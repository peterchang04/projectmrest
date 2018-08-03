var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/main');
var should = chai.should();

chai.use(chaiHttp);

describe('Maths', function() {
  describe('#max', function() {
    it('returns the biggest number from args', function(){
      var max = Math.max(1, 2, 10, 3);
      expect(max).to.equal(10);
    });
  });
});

describe('GET/v1/health', function() {
  it('should return 200', (done) => {
    chai.request(server)
    .get('/v1/health')
    .end((err, res) => {
      console.log(res);
      res.should.have.status(200);
      done();
    });
  });
});
