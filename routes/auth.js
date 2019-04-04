const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

router.get('/me', isLoggedIn(), (req, res, next) => {
  res.json(req.session.currentUser);
});

router.post('/login', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({
    username
  })
    .then((user) => {
      if (!user) {
        res.status(404);
        res.json({ message: 'Not Found', error: true });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200);
        res.json(user);
        return
      } else {
        res.status(401);
        res.json({ message: 'Unauthorized', error: true });
        return;
      }
    })
    .catch(next);
});

router.post('/signup', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
  const { username, password, profession, telephone } = req.body;

  User.findOne({
    username
  }, 'username')
    .then((userExists) => {
      if (userExists) {
        res.status(422);
        res.json({ message: 'Unprocessable Entity', error: true });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        profession,
        telephone
      });

      return newUser.save().then(() => {
        //TODO Delete password
        req.session.currentUser = newUser;
        res.status(200).json(newUser);
      });

    })
    .catch(next);
});

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

router.put('/:id', isLoggedIn(), async (req, res, next) => {
  const { _id, description, photo, profession, rate, telephone } = req.body.user;
  const { currentUser } = req.session

  if (!_id || !description || !photo || !profession || !rate || !telephone) {
    console.log("falta info")
    res.status(422);
    res.json({ 'message': 'Unprocessable Entity' });
    return;
  }

  if (!mongoose.Types.ObjectId(_id).equals(currentUser._id)) {
    res.status = 403;
    res.json({ 'message': 'Forbidden' });
    return;
  }

  try {
    const updatedUser = await User.findById(_id)

    updatedUser.description = description;
    updatedUser.photo = photo;
    updatedUser.profession = profession;
    updatedUser.rate = rate;
    updatedUser.telephone = telephone;
    updatedUser.save();

    req.session.currentUser = updatedUser;

    res.status(200);
    res.json({ user: updatedUser });
    return;

  } catch (err) {
    next(err);
  }
});

module.exports = router;