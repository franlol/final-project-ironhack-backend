exports.isLoggedIn = () => (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(401);
    res.json({ message: 'Unauthorized' });
    return;
  }
};

exports.isNotLoggedIn = () => (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    res.status(403);
    res.json({ message: 'Forbidden' })
    return;
  }
};

exports.validationLoggin = () => (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422);
    res.json({ message: 'Validation error', error: true });
    return;
  } else {
    next();
  }
}