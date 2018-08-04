module.exports = [
  { method: "GET", path: "/v1/health", model: "base", func: "health" },
  { method: "GET", path: "/v1/mongotest", model: "base", func: "testMongo" }
];
