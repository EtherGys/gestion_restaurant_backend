const mongoose = require('mongoose');

const Param = new mongoose.Schema({
    paramName: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Param', Param);