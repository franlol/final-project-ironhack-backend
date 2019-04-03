const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/:id', isLoggedIn(), async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            res.json({ 'message': 'User not valid' });
            return;
        }

        res.status(200);
        res.json({ user });
        return;

    } catch (err) {
        next(err);
    }

});



module.exports = router;