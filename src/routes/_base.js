ObjectID = require('mongodb').ObjectID;

let routes = [
  {
    method: "GET", path: "/v1/health",
    model: "base", func: "health"
  }
];

if (true /* TODO: is developemnt */) {
  const upsertMongoParams = { // reuse this
    _id: {            required: false,  type: "ObjectID" },
    name: {           required: true,   type: "string" },
    time: {           required: true,   type: "Date" },
    number: {         required: true,   type: "number" },
    defaultNumber: {  required: false,  type: "number", default: 99 },
    isGood: {         required: true,   type: "boolean" },
    notEmptyFail: {   required: false,  type: "string", notEmpty: true },
    objPass: {        required: true,   type: "object", notEmpty: true },
    objFail: {        required: true,   type: "object", notEmpty: true },
    arrayPass: {      required: true,   type: "Array", notEmpty: true },
    arrayFail: {      required: true,   type: "Array", notEmpty: true }
  };

  routes = routes.concat([
    {
      method: "PUT", path: "/v1/mongotest",
      model: "base", func: "upsertMongoTest",
      params: upsertMongoParams
    },
    {
      method: "PUT", path: "/v1/mongotest/:_id",
      model: "base", func: "upsertMongoTest",
      params: upsertMongoParams
    },
    {
      method: "GET", path: "/v1/mongotest",
      model: "base", func: "getMongoTest",
      params: {
        _id: { required: false,  type: "ObjectID" },
        per: {      required: false, type: 'number', default: 10 },
        page: {     required: false, type: 'number', default: 1 },
        order: {    required: false, type: 'string', default: 'desc' },
        orderBy: {  required: false, type: 'string', default: 'created' }
      }
    },
    {
      method: "GET", path: "/v1/mongotest/:_id",
      model: "base", func: "getMongoTest",
      params: {
        _id: { required: false,  type: "ObjectID" }
      }
    },
    {
      method: "DELETE", path: "/v1/mongotest/:_id",
      model: "base", func: "deleteMongoTest",
      params: {
        _id: { required: true,  type: "ObjectID" }
      }
    }
  ]);
}
module.exports = routes;
