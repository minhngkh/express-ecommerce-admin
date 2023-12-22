const createError = require("http-errors");

exports.require = (req, res, next) => {
  if (!res.locals.isAuthenticated) {
    return next(createError(401));
  }
  next();
};

exports.redirect = (destination) => {
  return (req, res, next) => {
    if (res.locals.isAuthenticated) {
      return res.redirect(destination);
    }
    next();
  };
};
