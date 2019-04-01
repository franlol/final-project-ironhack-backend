'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// const Need = require('../models/Need');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        default: 'Developer',
    },
    description: {
        type: String,
        default: 'This is the default description..',
        required: false
    },
    photo: {
        type: String,
        default: 'https://qsf.fs.quoracdn.net/-3-images.new_grid.profile_pic_anon.png-26-da5ea6d307f82722.png'
    },
    rating: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 10
    },
    needs: {
        type: [ObjectId],
        defailt: [],
        ref: 'Need',
    },
    jobsDone: {
        type: [ObjectId],
        default: [],
        ref: 'Need'
    },
    favorites: {
        type: [ObjectId],
        default: [],
        ref: 'Need'
    },
    applies: {
        type: [ObjectId],
        default: [],
        ref: 'User'
    },
    needsDone: {
        type: [ObjectId],
        default: [],
        ref: 'User'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;