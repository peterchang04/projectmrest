// const ObjectID = require('mongodb').ObjectID;

let routes = [
  {
    method: "POST", path: "/_v1/signal/setIndexes",
    model: "signal", func: "_setIndexes"
  },
  {
    method: "GET", path: "/v1/signal/identifier",
    model: "signal", func: "getIdentifier",
    params: {
      checkIdentifier: { required: false, type: "string" } // from cookie, check to see if it is still valid
    },
    description: `
      Returns a memorable identifier for browser client.
      If identifier is taken by someone else, return an updated one.
      Lifespan of 1 week after last use, before being released
    `,
  },
  {
    method: "GET", path: "/_v1/signal/identifier/:identifier",
    model: "signal", func: "_getIdentifier",
    params: {
      identifier: { required: true, type: "string" } // from cookie, check to see if it is still valid
    },
    description: `
      Check if identiifer exists.
      If yes but expired, delete and return no.
    `,
  },
  {
    method: "POST", path: "/_v1/signal/identifier",
    model: "signal", func: "_saveIdentifier",
    params: {
      identifier: { required: true, type: "string" }
    },
    description: `
      Raw identifier save. Subject to mongo unique index
    `
  },
  {
    method: "POST", path: "/_v1/signal/identifier/generate",
    model: "signal", func: "_generateIdentifier",
    params: {
      randomMin: { required: false, type: "number" },
      randomMax: { required: false, type: "number" }
    },
    description: `
      Generates a new identifier. Makes sure it's available, or regenerates
    `
  },
  {
    method: "DELETE", path: "/_v1/signal/identifier/:identifier",
    model: "signal", func: "_deleteIdentifier",
    params: {
      identifier: { required: true, type: "string" }
    }
  },
  {
    method: "GET", path: "/_v1/signal/ice",
    model: "signal", func: "_getIceServers"
  }
];

module.exports = routes;
