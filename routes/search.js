const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/', isLoggedIn(), async (req, res, next) => {
    const { search } = req.query

    try {
        // await Recipe.find({ '$text': { '$search': str } })
        const needs = await Need.find({ '$text': { '$search': search } });
        console.log(needs)
        if (needs.length === 0) {
            return res.status(204).json({ 'status': 204, 'message': '204 No Content', 'word': search });
        }

        const response = { 'status': 200, 'needs': needs, 'word': search };
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }

    // res.status(200);
    // res.json({ 'needs': needs });
    return;


});



module.exports = router;