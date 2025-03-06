const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbConnect = mongoose.connect(process.env.URL_MONGO)

module.exports = dbConnect