// help catch errors from /model
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
  .catch((e) => {
    console.error(e);
    next();
  });
};
