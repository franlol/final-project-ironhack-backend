const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SocketManager = require('../helpers/SocketManager');

const Need = require('../models/Need');
const User = require('../models/User');
const Apply = require('../models/Apply');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

// New one
router.post('/add', isLoggedIn(), async (req, res, next) => {
    const { id, title, rate, description, tags } = req.body;

    if (!id || !title || !rate || !description || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        // return;
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

        // Emiting a socket to update homepage
        SocketManager.homeNewNeed();
        
        res.status(200);
        res.json({ need: createdNeed });
        // return;
    } catch (err) {
        next(err);
    }

});

// getting last 20
router.get('/latest', isLoggedIn(), async (req, res, next) => {
    try {
        const latest = await Need.find({ isActive: true }).sort({ 'created_at': -1 }).limit(10);

        res.status(200);
        res.json({ latest });
        return;

    } catch (err) {
        next(err);
    }


});

// Get all needs
router.get('/all', isLoggedIn(), async (req, res, next) => {

    try {
        const needs = await Need.find();

        if (needs.length === 0) {
            res.status(204);
            // res.json({ 'message': 'No content' }); // Not sending message if 204 :)
        }

        res.status(200);
        res.json({ needs });

    } catch (err) {
        next(err);
    }
});

// Get all from user
router.get('/all/:id', isLoggedIn(), async (req, res, next) => {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const needs = await Need.find({ owner: userId });

        if (needs.length === 0) {
            res.status(204);
            // res.json({ 'message': 'No content' }); // Not sending message if 204 :)
        }

        res.status(200);
        res.json({ needs });

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
    } catch (err) {
        next(err);
    }

});

// edit need
// TODO check: req.body OR params? if is body I dont need :id
router.put('/:id', isLoggedIn(), async (req, res, next) => {
    const { userId } = req.body;
    const { needId, title, rate, description, tags } = req.body.need;

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
        need.tags = tags;
        need.description = description;
        need.save();

        // Emiting a socket to update homepage
        SocketManager.homeNewNeed();
        // Emiting a socket to update needDetail
        SocketManager.editNeed();

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

        // Emiting a socket to update homepage
        SocketManager.homeNewNeed();
        // If you are checking a Need detail and user delete that Need, this socket is emited to redirect home
        SocketManager.deleteApply();

        res.status(200);
        res.json({ 'message': 'OK' });
        return;
    } catch (err) {
        next(err);
    }

});

module.exports = router;