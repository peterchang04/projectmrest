var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server').server;
chai.use(chaiHttp);

const persistValues = {}; // save value across requests
const expectedShape = {
  "time": "20180807T223501Z",
  "number": 5,
  "isGood": false,
  "name": "yourname",
  "notEmptyFail": "asdfasd",
  "objPass": { "hi": 1 },
  "objFail": { "bye" : 1 },
  "arrayPass": [1],
  "arrayFail": [0, 1, 2]
};

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
    .send(Object.assign({}, expectedShape, {
      number: "5", // send string 5 and expect number back
      doesntBelong: "asdf" // send this but don't expect it back
    }))
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal("PUT/v1/mongotest");
      const data = res.body.data;
      // save the _id for later
      persistValues._id = res.body.data[0]._id;
      persistValues.created = res.body.data[0].created;
      // remove dynamic keys that can't be tested
      delete data[0]._id;
      delete data[0].created;

      expect(data).to.deep.equal([
        Object.assign({}, expectedShape, {
          time: "2018-08-07T22:35:01.000Z",
          defaultNumber: 99,
          _recordCount: 1,
          _record: 0
        })
      ]);
      // should have created flag
      expect(persistValues.created.length).to.equal(24); // should have a create flag
      done();
    });
  }).timeout(1000);;
});

describe('PUT/v1/mongotest (add new #2)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .put('/v1/mongotest')
    .set('content-type', 'application/json')
    .send(Object.assign({}, expectedShape, {
      time: "20180808T080808Z",
      objPass: { "hi": 0, "bye": 0 }, // complex obj
      objFail: { "bye" : 1, "hi": 1 }, // complex obj
      arrayFail: [{ id: 1}, { id: 2 }], // nested shape in array
      defaultnumber: 1 // lcased, overwrite default number
    }))
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.target).to.equal("PUT/v1/mongotest");
      const data = res.body.data;
      // save the _id for later
      persistValues._id2 = res.body.data[0]._id;
      // remove dynamic keys that can't be tested
      delete data[0]._id;
      delete data[0].created;

      expect(data).to.deep.equal([
        Object.assign({}, expectedShape, {
          time: "2018-08-08T08:08:08.000Z",
          objPass: { "hi": 0, "bye": 0 }, // complex obj
          objFail: { "bye" : 1, "hi": 1 }, // complex obj
          arrayFail: [{ id: 1}, { id: 2 }], // nested shape in array
          defaultNumber: 1, // correctly cased
          _recordCount: 1,
          _record: 0
        })
      ]);
      done();
    });
  }).timeout(1000);;
});

describe('GET/v1/mongotest (query for recently added 2)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .get('/v1/mongotest?per=2&order=desc&orderBy=created')
    .end((err, res) => {
      expect(res.status).to.equal(200);
      const data = res.body.data; // array of the 2 just created

      expect(data[0]._id).to.equal(persistValues._id2);
      expect(data[1]._id).to.equal(persistValues._id);
      done();
    });
  }).timeout(1000);;
});

describe('PUT/v1/mongotest/:_id (update #1)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .put(`/v1/mongotest/${persistValues._id}`)
    .send(Object.assign({}, expectedShape, {
      number: "-1",
      name: "I gots updated",
      time: "20010101T111111Z"
    }))
    .end((err, res) => {
      expect(res.status).to.equal(200);
      const data = res.body.data;
      persistValues.modified = res.body.data[0].modified;
      // remove dynamic keys that can't be tested
      delete data[0].modified;

      expect(data).to.deep.equal([
        Object.assign({}, expectedShape, {
          _id: persistValues._id, // is indeed the same record
          number: -1,
          name: "I gots updated",
          time: "2001-01-01T11:11:11.000Z",
          created: persistValues.created, // created has not changed
          defaultNumber: 99,
          _recordCount: 1,
          _record: 0
        })
      ]);
      // should have modified flag now
      expect(persistValues.modified.length).to.equal(24);
      expect(res.body.data[0].modified).to.not.equal(res.body.data[0].created);
      done();
    });
  }).timeout(1000);;
});

describe('GET/v1/mongotest/:_id (query for updated one)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .get(`/v1/mongotest/${persistValues._id}`)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      const data = res.body.data;
      persistValues.modified = res.body.data[0].modified;

      expect(data).to.deep.equal([
        Object.assign({}, expectedShape, {
          _id: persistValues._id, // is indeed the same record
          number: -1,
          name: "I gots updated",
          time: "2001-01-01T11:11:11.000Z",
          created: persistValues.created, // created has not changed,
          modified: persistValues.modified,
          defaultNumber: 99,
          _recordCount: 1,
          _record: 0
        })
      ]);
      done();
    });
  }).timeout(1000);;
});

describe('DELETE/v1/mongotest/:_id (remove _id)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .delete(`/v1/mongotest/${persistValues._id}`)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal([
        {
          _id: persistValues._id,
          deleted: 1
        }
      ]);
      done();
    });
  }).timeout(1000);;
});

describe('DELETE/v1/mongotest/:_id2 (remove _id2)', function() {
  it('request checks out', (done) => {
    chai.request(server)
    .delete(`/v1/mongotest/${persistValues._id2}`)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.data).to.deep.equal([
        {
          _id: persistValues._id2,
          deleted: 1
        }
      ]);
      done();
    });
  }).timeout(1000);;
});
