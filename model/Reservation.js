const mongoose = require('mongoose');
const Reservation = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    dateDebut: {type: Date, required: true},
    dateFin: {type: Date, required: true},
    dinersNumber: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Reservation', Reservation);