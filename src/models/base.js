const mdb = require('../utils/mdb');
const defineArgs = require('../utils/param').defineArgs;
const ObjectID = require('mongodb').ObjectID;

module.exports.health = async (params) => {
  return [];
};

module.exports.getMongoTest = async (params) => {
  const args = defineArgs(params, {
    _id: {      required: false, type: 'ObjectID' },
    per: {      required: false, type: 'number', default: 10 },
    page: {     required: false, type: 'number', default: 1 },
    order: {    required: false, type: 'string', default: 'desc' },
    orderBy: {  required: false, type: 'string', default: 'created' }
  });

  const filter = {};
  if ('_id' in args) {
    filter._id = args._id;
  }

  const options = {
    limit: args.per,
    skip: (args.page - 1) * args.per,
    sort: [[ args.orderBy, args.order ]]
  };

  // get the total
  let count = await mdb.collection('test').find(filter).count();

  // query for documents
  let result = [];
  if (count > 0) { // don't bother querying if count is already 0
    result = await mdb.collection('test').find(filter, options).toArray();
  }

  // include paginate columns
  result = mdb.addPaginateColumns(result, args.per, args.page, count);

  return result;
};

module.exports.upsertMongoTest = async (params) => {
  const args = defineArgs(params, {
    _id: {            required: false, type: "ObjectID", default: new ObjectID() },
    name: {           required: true, type: 'string' },
    time: {           required: true, type: 'Date' },
    number: {         required: true, type: 'number' },
    defaultNumber: {  required: true, type: 'number' },
    isGood: {         required: true, type: 'boolean' },
    objPass: {        required: true, type: 'object' },
    objFail: {        required: true, type: 'object' },
    arrayPass: {      required: true, type: 'Array' },
    arrayFail: {      required: true, type: 'Array' },
    created: {        required: false, type: 'Date', default: new Date() }
  });

  if (params._id) { // update instead of insert
    delete args.created;
    args.modified = new Date();
  }

  const request = await mdb.collection('test').update({ _id: args._id }, { $set: args }, { upsert: true });
  // use get function to return new record
  if (request.result.upserted && request.result.upserted.length) {
    return await module.exports.getMongoTest({ _id: request.result.upserted[0]._id });
  } else if (request.result.nModified === 1) {
    return await module.exports.getMongoTest({ _id: args._id });
  }
  // made it here? shouldn't have
  throw new Error('Upsert failed');
};

module.exports.deleteMongoTest = async (params) => {
  const args = defineArgs(params, {
    _id: { required: true, type: "ObjectID" }
  });

  const request = await mdb.collection('test').deleteOne({ _id: args._id });
  if (request.deletedCount > 1) {
    throw new Error(`more than one [test] deleted _id: ${args._id}`);
  } if (request.deletedCount === 0) {
    return [];
  }
  return [{ _id: args._id, deleted: 1 }];
};
