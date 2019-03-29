const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

// New one
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
router.post('/:id', isLoggedIn(), async (req, res, next) => {
    const { userId } = req.body;
    const { needId, title, rate, description } = req.body.need;

    if (!userId || !needId || !title || !rate || !description || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(needId)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

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

});

module.exports = router;

// { isActive: true,
//     _id: 5c9d212b641885274272858f,
//     owner: 5c9d074c9f38250f955ec0a7,
//     title: 'test title',
//     rate: 123,
//     description: 'test desc',
//     created_at: 2019-03-28T19:31:55.014Z,
//     updated_at: 2019-03-28T19:31:55.014Z,
//     __v: 0 }



// { needId: '5c9e8688d140cc0e8ae0f120',
//   title: '1233',
//   rate: '123',
//   description: '21331232321' }

