const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
const User = require('../models/User');
const Apply = require('../models/Apply');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

/*
    CREATE:      POST   /need/add
    READ -20:    GET    /need/latest
    READ by id:  GET    /need/:id
    UPDATE:      PUT   /need/:id
    DELETE:      DELETE /need/:id
*/

// New one
router.post('/add', isLoggedIn(), async (req, res, next) => {
    const { id, title, rate, description, tags } = req.body;
console.log(req.body)
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

        const newNeed = new Need({ owner: id, title, rate, description, tags });
        const createdNeed = await newNeed.save();

        res.status(200);
        res.json({ need: createdNeed });
        return;
    } catch (err) {
        next(err);
    }

});

// getting last 20
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

// get by id
router.get('/:id', isLoggedIn(), async (req, res, next) => {
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

// edit need
// TODO check: req.body OR params? if is body I dont need :id
router.put('/:id', isLoggedIn(), async (req, res, next) => {
    const { userId } = req.body;
    const { needId, title, rate, description } = req.body.need;

    if (!userId || !needId || !title || !rate || !description || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(needId)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const need = await Need.findById(needId);

        if (!mongoose.Types.ObjectId(userId).equals(need.owner)) {
            res.status = 403;
            res.json({ 'message': 'Forbidden' });
            return;
        }

        need.title = title;
        need.rate = rate;
        need.description = description;
        need.save();

        res.status(200);
        res.json(need);
        return;
    } catch (err) {
        next(err);
    }

});

// Delete need
router.delete('/:id', async (req, res, next) => {
    const { needId, userId } = req.body;

    if (!needId || !mongoose.Types.ObjectId.isValid(needId)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const need = await Need.findById({ _id: needId });

        if (!mongoose.Types.ObjectId(userId).equals(need.owner)) {
            res.status = 403;
            res.json({ 'message': 'Forbidden' });
            return;
        }

        need.remove();

        // After removing a need, I remove all applies relationships
        await Apply.find({ 'need': needId }).deleteMany(); // remove here is marked as deprecated

        res.status(200);
        res.json({ 'message': 'OK' });
        return;
    } catch (err) {
        next(err);
    }

});

module.exports = router;

