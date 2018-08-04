const mdb = require('../utils/mdb');

module.exports = {
  health: function health(req, res, next) {
    res.send('i healthy');
    next();
  },
  testMongo: (req, res, next) => {
    const cursor = mdb.collection('test').find({})
    cursor.toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      next();
    });
  }
};
