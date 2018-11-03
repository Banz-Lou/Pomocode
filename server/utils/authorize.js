module.exports.access = (req, res, next) => {
  if (req.session.passport !== undefined) {
    next();
  } else {
    res.redirect('/login');
  }
};