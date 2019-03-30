'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = require('./User');
const Need = require('./Need');

const applySchema = new Schema(
    {
        need: {
            type: ObjectId,
            ref: 'Need',
            required: true,
        },
        applicant: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            required: false,
            default: '',
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const Apply = mongoose.model('Apply', applySchema);

module.exports = Apply;