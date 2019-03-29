const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

router.post('/add', isLoggedIn(), async (req, res, next) => {
    const { id, title, rate, description } = req.body;

    if (!id || !title || !rate || !description || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const user = User.findById(id);
        if (!user) {
            res.status(404);
            res.json({ 'message': 'User not valid' });
            return;
        }

        const newNeed = new Need({ owner: id, title, rate, description });
        const createdNeed = await newNeed.save();

        res.status(200);
        res.json({ need: createdNeed });
        return;
    } catch (err) {
        next(err);
    }

});

router.get('/latest', isLoggedIn(), async (req, res, next) => {
    try {
        const latest = await Need.find({ isActive: true }).sort({ 'created_at': -1 }).limit(20);

        res.status(200);
        res.json({ latest });
        return;

    } catch (err) {
        next(err);
    }


});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const need = await Need.findById({ _id: id }).populate('owner');

        if (need) {
            res.status(200);
            res.json(need);
            return;
        }
        res.status(404);
        res.json({ 'message': 'Content not found' });
        return;
    } catch (err) {
        next(err);
    }

});

module.exports = router;
