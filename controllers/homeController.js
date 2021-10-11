exports.home_page = function(req, res, next) {
  res.render('index', {currentUser: res.locals.currentUser});
};
