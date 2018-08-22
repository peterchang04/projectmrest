const mdb = require('../utils/mdb');
const defineArgs = require('../utils/param').defineArgs;
const date = require('../utils/date');
const identifierUtil = require('../utils/identifier');
const ObjectID = require('mongodb').ObjectID;

async function _setIndexes() {
  // set indexes for signal collections
  const result = await mdb.collection('identifier').ensureIndex('identifier', { unique: true });
  return [{
    collection: 'identifier', unique: true
  }];
};

async function getIdentifier(params) {
  const args = defineArgs(params, {
    checkIdentifier: { required: false, type: 'string' }
  });

  if (args.checkIdentifier) {
    const checkResult = await _checkIdentifier({ identifier: args.checkIdentifier });
    if (checkResult[0].exists) {
      // update the record's modified date
      const updateResult = await mdb.collection('identifier').update(
        { identifier: args.checkIdentifier },
        { $set: { modified: new Date() }}
      );
      return [{ identifier: args.checkIdentifier }];
    }
  }

  // IT DOESN'T EXIST!
  return await _generateIdentifier();
};

async function _saveIdentifier(params) {
  const args = defineArgs(params, {
    identifier: { required: true, type: 'string' }
  });

  // record it
  const _id = new ObjectID();
  const request = await mdb.collection('identifier').update(
    { _id, },
    {
      $set: {
        identifier: args.identifier,
        created: new Date(),
        modified: new Date()
      }
    },
    { upsert: true }
  );

  if (request.result.upserted && request.result.upserted.length) {
    return [{ _id: request.result.upserted[0]._id, identifier: args.identifier }];
  }
  // made it here? shouldn't have
  throw new Error('Upsert failed');
};

async function _deleteIdentifier(params) {
  const args = defineArgs(params, {
    identifier: { required: true, type: 'string', notEmpty: true }
  });

  const request = await mdb.collection('identifier').deleteOne({ identifier: args.identifier });
  if (request.deletedCount === 1) {
    return [{ identifier: args.identifier, deleted: true }];
  } if (request.deletedCount === 0) {
    return [];
  }
};

async function _checkIdentifier(params) {
  let exists = false;
  let expiredDeleted = false; // set to true if expired iden was removed
  const args = defineArgs(params, {
    identifier: { required: true, type: 'string', notEmpty: true },
    expireMinutes: { required: false, type: 'number', default: (60 * 24 * 7) }
  });

  const filter = { identifier: args.identifier };
  const result = await mdb.collection('identifier').find(filter).toArray();

  // IT EXISTS, but check for valid date
  if (result.length === 1) {
    exists = true;
    // check the last modified date
    const ageMinutes = date.diff(result[0].modified, new Date());
    if (ageMinutes > args.expireMinutes) {
      // delete it and return false
      const delResult = await _deleteIdentifier(args);
      exists = false;
      expiredDeleted = true;
    }
  }

  // return existing identifier
  return [{ identifier: args.identifier, exists, expiredDeleted }];
};

async function _generateIdentifier(params) {
  const maxAttempts = 10;
  let attempt = 0;
  const args = defineArgs(params, {
    randomMin: { required: false, type: 'number', default: 5 },
    randomMax: { required: false, type: 'number', default: 99 }
  });

  let identifier = null;
  while (!identifier) {
    attempt++;
    if (attempt > maxAttempts) throw new Error('signal._generateIdentifier() too many attempts');
    const identifierCandidate = identifierUtil.generate(args.randomMin, args.randomMax);
    // check to see if it's taken
    const checkResult = await _checkIdentifier({ identifier: identifierCandidate });
    if (checkResult[0].exists === false) {
      identifier = identifierCandidate;
    }
  }

  // made it here? must have gotten a good identifier
  const saveResult = await _saveIdentifier({ identifier });
  saveResult[0].attempts = attempt;
  return saveResult;
};

module.exports = {
  getIdentifier,
  _setIndexes,
  _checkIdentifier,
  _deleteIdentifier,
  _saveIdentifier,
  _generateIdentifier
};
