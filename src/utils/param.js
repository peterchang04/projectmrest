ObjectID = require('mongodb').ObjectID,

// PARAMS FROM HTTP - clean up, filter on definition.
module.exports.sanitizeParams = (definition = {}, params = {}, errors) => {
  // lowercase both params and definition. API is case insensitive to HTTP traffic
  const lcParams = _lowerCaseKeys(params);
  const lcDefinition = _lowerCaseKeys(definition, true);

  // first make sure each param allowed past is in definitons
  Object.keys(lcParams).forEach((key) => {
    const lcKey = key.toLowerCase();
    if (!(lcKey in lcDefinition)) {
      delete lcParams[key];
    }
  });
  // ALL REMAINING PARAMS HAVE DEFINITION

  // now check for required, type, and set defaults
  Object.keys(lcDefinition).forEach(lcKey => {
    const casedKey = lcDefinition[lcKey].casedKey || lcKey;
    const type = lcDefinition[lcKey].type;

    // set default
    if (lcDefinition[lcKey].default !== undefined && !(lcKey in lcParams)) {
      lcParams[lcKey] = lcDefinition[lcKey].default;
    }

    // check required
    if (lcDefinition[lcKey].required && !(lcKey in lcParams)) {
      errors.push(`[${casedKey}] is required`);
    }

    if (lcKey in lcParams) {
      // implicitTransform, 0 => false for type boolean, 15 => '15' for type string etc
      lcParams[lcKey] = types[type].implicitTransform(lcParams[lcKey]);

      // check type
      if (!types[type].isType(lcParams[lcKey])) {
        errors.push(`[${casedKey}] should be type "${type}"`);
      }

      // check notEmpty
      if (lcDefinition[lcKey].notEmpty && types[type].isEmpty(lcParams[lcKey])) {
        errors.push(`[${casedKey}] cannot be blank`);
      }
    }
  });

  // replace all the params with cased verison of key, per routes
  Object.keys(lcParams).forEach(lcKey => {
    const casedKey = lcDefinition[lcKey].casedKey || lcKey;
    if (casedKey !== lcKey) {
      lcParams[casedKey] = lcParams[lcKey];
      delete lcParams[lcKey];
    }
  });

  return lcParams;
};

// Function level params, throw errors and allow non defined past
// NOTE: these are case sensitive
module.exports.defineArgs = (params, definition) => {
  const paramsCopy = Object.assign({}, params);
  const errors = [];
  Object.keys(definition).forEach(key => {
    // check required
    if (definition[key].required && !(key in paramsCopy)) {
      errors.push(`[${key}] is required`);
    }

    // set default
    if (definition[key].default !== undefined && !(key in paramsCopy)) {
      paramsCopy[key] = definition[key].default;
    }

    // type check
    if ((key in paramsCopy) && !types[definition[key].type].isType(paramsCopy[key])) {
      let actualType = typeof paramsCopy[key];
      if (actualType === 'object') actualType = paramsCopy[key].constructor.name;
      errors.push(`[${key}] should be type [${definition[key].type}] was [${actualType}]`);
    }

    // check notEmpty
    if (definition[key].notEmpty && types[definition[key].type].isEmpty(paramsCopy[key])) {
      errors.push(`[${key}] cannot be blank`);
    }
  });

  if (errors.length) {
    throw new Error(errors.join(', '));
  }

  return paramsCopy;
}

// copy object w/ all lowercased keys
function _lowerCaseKeys(obj = {}, addCasedKey = false) {
  const objCopy = Object.assign({}, obj);
  Object.keys(objCopy).forEach((key) => {
    const lowerCaseKey = key.toLowerCase();
    if (key !== lowerCaseKey) {
      objCopy[lowerCaseKey] = obj[key];

      // add the original cased key from route definition as reference
      if (addCasedKey) {
        objCopy[lowerCaseKey].casedKey = key;
      }
      delete objCopy[key];
    }
  });
  return objCopy;
}

// TYPE BASED FUNCTIONS. when coming from http, first transform, then validate w/ isType()
const types = {
  string: {
    implicitTransform: (value) => {
      if (typeof value === 'number') return `${value}`;
      return value;
    },
    isType: (value) => {
      return (typeof value === 'string');
    },
    isEmpty: (value) => {
      return (types.string.isType(value) && value === '');
    }
  },
  Date: { // caps because it is the constructor.name (which may be useful programmatically at some point)
    implicitTransform: (value) => {
      if (typeof value === 'string' && value.length === 16 && value[15] === 'Z' && value[8] === 'T') {
        return new Date(Date.UTC(
          value.substring(0,4), // yyyy
          value.substring(4,6)-1, // mm (0-11)
          value.substring(6,8), // dd
          value.substring(9,11), // hh
          value.substring(11,13), // mm
          value.substring(13,15) // ss
        ));
      }
      return value;
    },
    isType: (value) => {
      return (typeof value === 'object' && value.constructor.name === 'Date' && Boolean(value.getTime()));
    },
    isEmpty: (value) => {
      return false; // date is never empty
    }
  },
  boolean: {
    implicitTransform: (value) => {
      if (value === 1 || value === '1' || value === 'true') { return true; };
      if (value === 0 || value === -1 || value === '0' || value === '-1' || value === 'false') { return false; };
      return value;
    },
    isType: (value) => {
      return (typeof value === 'boolean');
    },
    isEmpty: (value) => {
      return false; // boolean is never empty
    }
  },
  number: {
    implicitTransform: (value) => {
      if (typeof value === 'string') return +value;
      return value;
    },
    isType: (value) => {
      return (typeof value === 'number' && !isNaN(value));
    },
    isEmpty: (value) => {
      return false; // number is never empty
    }
  },
  object: {
    implicitTransform: (value) => {
      return value; // no transform, either it is obj or not
    },
    isType: (value) => {
      return (typeof value === 'object' && value.constructor.name === 'Object');
    },
    isEmpty: (value) => {
      return (types.object.isType(value) && Object.keys(value).length === 0);
    }
  },
  Array: { // caps because it is the constructor.name (which may be useful programmatically at some point)
    implicitTransform: (value) => {
      return value; // no transform, either it's an array or not
    },
    isType: (value) => {
      return Array.isArray(value);
    },
    isEmpty: (value) => {
      return (types.Array.isType(value) && value.length === 0);
    }
  },
  ObjectID: { // MongoDB type
    implicitTransform: (value) => {
      if (typeof value === 'string' && value.length === 24) return new ObjectID(value);
      return value;
    },
    isType: (value) => {
      return (typeof value === 'object' && value.constructor.name === 'ObjectID');
    },
    isEmpty: (value) => {
      return false; // ObjectID cannot be empty
    }
  }
};
module.exports.types = types;
