const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
const User = require('../models/User');
const Apply = require('../models/Apply');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

// Add new apply
router.post('/:id', isLoggedIn(), async (req, res, next) => {
    const { userId, needId, comment } = req.body;

    if (!userId || !needId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(needId)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const newApply = await Apply.create({
            need: needId,
            applicant: userId,
            comment
        });

        if (!newApply) {
            res.status(404);
            res.json({ 'message': 'Apply not valid' });
            return;
        }
        res.status(200);
        res.json({ apply: newApply });
        return;

    } catch (err) {
        next(err);
    }

});

router.get('/:id/getall', async (req, res, next) => {

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        // getting all applies populated with applicant user
        const applies = await Apply.find({ 'need': id }).populate('applicant');

        res.status(200);
        res.json({ 'allApplies': applies });
        return;
        
    } catch (err) {
        next(err)
    }

});

module.exports = router;