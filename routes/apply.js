const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');
// const User = require('../models/User');
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

        // When making new apply, I put +1, so the Need have a notification.
        const need = await Need.findById({ _id: needId });
        need.waitingNotification = need.waitingNotification + 1;
        need.save();

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

router.get('/:id/getall', isLoggedIn(), async (req, res, next) => {

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

// Update Apply status
router.put('/:id', isLoggedIn(), async (req, res, next) => {
    const { status, userId, applyId } = req.body;

    const statusCondition = status !== '' || (status !== 'Pending' && status !== 'Accepted' && status !== 'Declined');
    const idCondition = mongoose.Types.ObjectId.isValid(userId);

    if (!statusCondition || !idCondition) {
        res.status(422);
        res.json({ 'message': 'Unprocessable Entity' });
        return;
    }

    try {
        const apply = await Apply.findById(applyId);

        // I get the need to check if needOwner is equals to userId (to dodge postman hackies :D) and add or remove waiting notification (to show in prof x example)
        const need = await Need.findById({ _id: apply.need })

        if (!mongoose.Types.ObjectId(need.owner).equals(userId)) {
            res.status = 403;
            res.json({ 'message': 'Forbidden' });
            return;
        }

        need.waitingNotification = status === 'Pending' ? need.waitingNotification + 1 : need.waitingNotification - 1;
        need.save();

        apply.status = status;
        apply.save();
        console.log(apply)

        res.status(200);
        res.json({ 'Apply': apply });
        return;

    } catch (err) {
        next(err);
    }

})

module.exports = router;