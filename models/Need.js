'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = require('./User');

const needSchema = new Schema({
    owner: {
        type: ObjectId,
        required: true,
        ref: User
    },
    title: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

const Need = mongoose.model('Need', needSchema);

module.exports = Need;