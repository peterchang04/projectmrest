const MongoClient = require('mongodb').MongoClient;
const dbName = 'test';
const option = { useNewUrlParser: true };
const username = 'app';
const password = 'lQD2ayo9imUuCaKH';
let uri = `mongodb+srv://${encodeURIComponent(`${username}:${password}`)}@cluster0-isoin.gcp.mongodb.net/test?retryWrites=true`;

let connection = null;

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(uri, option, function(err, client) {
        if (err) {
          reject(err);
          return;
        };
        resolve(client);
        connection = client;
    });
});

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
