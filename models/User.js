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
        default: 'https://firebasestorage.googleapis.com/v0/b/serv-seeker.appspot.com/o/images%2Fprofile.png?alt=media&token=28f5da76-91d8-4352-a05a-af5a188f5613'
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