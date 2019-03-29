const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

router.post('/:id', isLoggedIn(), async (req, res, next) => {
    console.log(req.params);



});

module.exports = router;