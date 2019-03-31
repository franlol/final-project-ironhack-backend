const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Need = require('../models/Need');

const { isLoggedIn } = require('../helpers/middlewares');

router.get('/', isLoggedIn(), async (req, res, next) => {
    const {search} = req.query
    
    try {
        // const needs = await Need.find();

        // res.status(200);
        // res.json({ 'needs': needs });
        return;

    } catch (err) {
        next(err)
    }

});



module.exports = router;