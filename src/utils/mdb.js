const MongoClient = require('mongodb').MongoClient;
const dbName = process.env.mongoDatabase;
const option = { useNewUrlParser: true, connectTimeoutMS: 20000 };
const username = process.env.mongoUsername;
const password = process.env.mongoPassword;
const endpoint = process.env.mongoEndpoint;
// retryWrites = true commented out for indexes ops, which fail when retryWrites=true
// let uri = `mongodb+srv://${encodeURIComponent(`${username}:${password}`)}@cluster0-isoin.gcp.mongodb.net/test?retryWrites=true`;
let uri = `mongodb+srv://${encodeURIComponent(`${username}:${password}`)}@${endpoint}/${dbName}`;

let connection = null;

connect = (callback) => new Promise((resolve, reject) => {
  MongoClient.connect(uri, option, function(err, client) {
    if (err) {
      reject(err);
      return;
    };
    resolve(client);
    connection = client;
  });
});

module.exports.init = async () => {
  try {
    connection = await connect();
  } catch (e) {
    // hard exit on db connection error
    console.error(e);
    process.exit(1);
  }
  console.log('MongoDB connected');
};

module.exports.collection = (colName) => {
  if(!connection) {
      throw new Error('Call connect first!');
  }
  return connection.db(dbName).collection(colName);
}

module.exports.close = () => {
  if (connection) {
    console.log('closing MongoDB connection');
    connection.close();
  }
}

module.exports.addPaginateColumns = (result, per, page, count) => {
  result.forEach(row => {
    row._record = (page - 1) * per;
    row._recordCount = count;
  });
  return result;
};
