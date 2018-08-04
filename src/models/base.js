module.exports = {
  health: function health(req, res, next) {
    res.send('i healthy');
    next();
  }
};
