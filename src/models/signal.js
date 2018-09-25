const mdb = require('../utils/mdb');
const defineArgs = require('../utils/param').defineArgs;
const date = require('../utils/date');
const identifierUtil = require('../utils/identifier');
const ObjectID = require('mongodb').ObjectID;
// twilio
const twilioAccountSid = process.env.twilioAccountSid;
const twilioAuthToken = process.env.twilioAuthToken;
const client = require('twilio')(twilioAccountSid, twilioAuthToken);
let twilioToken = null;
let twilioTokenCreated = null;

async function _setIndexes() {
  // set indexes for signal collections
  const result = await mdb.collection('identifier').ensureIndex('identifier', { unique: true });
  return [
    { collection: 'identifier', unique: true }
  ];
};

async function getIdentifier(params) {
  const args = defineArgs(params, {
    preferredIdentifier: { required: false, type: 'string' }
  });

  let identifier = null;
  let attempts = null;

  // if a browser has an identifier we want to persist it best of ability
  if (args.preferredIdentifier) {
    const existingIdentifier = await _getIdentifier({ identifier: args.preferredIdentifier });
    // see if preferred is taken by another socketId
    if (existingIdentifier.length === 1) {
      identifier = existingIdentifier[0].identifier;
    } else {
      const saveIdentifier = await _saveIdentifier({ identifier: args.preferredIdentifier });
      identifier = saveIdentifier[0].identifier;
    }
  }

  // Still no identifier?
  if (!identifier) {
    const identifierResult = await _generateIdentifier();
    identifier = identifierResult[0].identifier;
  }

  return [{ identifier }];
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
    identifier: { required: false, type: 'string', notEmpty: true }
  });

  const request = await mdb.collection('identifier').deleteOne({ identifier: args.identifier });
  if (request.deletedCount === 1) {
    return [{ identifier: args.identifier, deleted: true }];
  } if (request.deletedCount === 0) {
    return [];
  }
};

async function _getIdentifier(params) {
  const args = defineArgs(params, {
    identifier: { required: true, type: 'string', notEmpty: true }
  });
  return await mdb.collection('identifier').find({ identifier: args.identifier }).toArray();
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
    const checkResult = await _getIdentifier({ identifier: identifierCandidate });
    if (checkResult.length === 0) {
      identifier = identifierCandidate;
    }
  }

  // made it here? must have gotten a good identifier
  const saveResult = await _saveIdentifier({ identifier });
  saveResult[0].attempts = attempt;
  return saveResult;
};

function _getTwilioTokenPromise() { // wrap twilio token in promise for async usage
  return new Promise((resolve, reject) => {
    try {
      client.tokens.create()
      .then(token => {
        resolve(token);
      }).done();
    } catch (e) {
      reject(e);
    }
  });
}

async function _getIceServers(params) {
  // get a new token every 20 hrs. Tokens are good for 24 hrs, but client side caches for 2hr so buffer time
  if (!twilioToken || date.diff(twilioTokenCreated, new Date()) > (60 * 20 /* 20 hrs */)) {
    twilioToken = await _getTwilioTokenPromise();
    twilioTokenCreated = new Date();
  }
  return twilioToken.iceServers;
};

module.exports = {
  getIdentifier,
  _setIndexes,
  _deleteIdentifier,
  _saveIdentifier,
  _generateIdentifier,
  _getIceServers,
  _getIdentifier
};
