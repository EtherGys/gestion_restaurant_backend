const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./config');
const userRoute = require('./routes/user')
const reservationRoute = require('./routes/reservation')
const paramRoute = require('./routes/param')
require('./cronTask')

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoute)
app.use('/reservation', reservationRoute)
app.use('/param', paramRoute)

db.then(() => {
console.log("connected to db");

}).catch(err => console.log(err))



app.listen(process.env.PORT);