var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server').server;
chai.use(chaiHttp);

describe('GET/v1/health', function() {
  it('should return 200 { healthy: true }', (done) => {
    chai.request(server)
    .get('/v1/health')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        params_RAW: {},
        target: "GET/v1/health",
        healthy: true
      });
      done();
    });
  }).timeout(1000);
});

describe('PUT/v1/mongotest (add 1 new)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .put('/v1/mongotest')
    .set('content-type', 'application/json')
    .send({
      "time": "20180807T223501Z",
      "number": 5,
      "isGood": false,
      "doesntBelong": "asdf",
      "name": "yourname",
      "notEmptyFail": "asdfasd",
      "objpass": { "hi": 1 },
      "objfail": { "bye" : 1 },
      "arrayPass": [1],
      "arrayFail": [0, 1, 2]
    })
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal("PUT/v1/mongotest");
      const data = res.body.data;
      // remove dynamic keys that can't be tested
      delete data[0]._id;
      delete data[0].created;

      expect(data).to.deep.equal([
        {
          "time": "2018-08-07T22:35:01.000Z",
          "number": 5,
          "name": "yourname",
          "objPass": {
              "hi": 1
          },
          "objFail": {
              "bye": 1
          },
          "isGood": false,
          "notEmptyFail": "asdfasd",
          "arrayPass": [
              1
          ],
          "arrayFail": [
              0,
              1,
              2
          ],
          "defaultNumber": 99,
          "_record": 0,
          "_recordCount": 1
        }
      ]);
      done();
    });
  }).timeout(1000);;
});

//
// describe('GET/v1/mongotest (get limit 10)', function() {
//   it('request checks out', (done) => {
//     chai.request(server)
//     .get('/v1/mongotest')
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       expect(res.body).to.deep.equal({ data: [] });
//       done();
//     });
//   }).timeout(1000);;
// });
//

//
//
// describe('GET/v1/mongotest', function() {
//   it('request checks out', (done) => {
//     chai.request(server)
//     .get('/v1/mongotest')
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       expect(res.body).to.deep.equal({ data: [] });
//       done();
//     }).timeout(1000);;
//   });
// });
