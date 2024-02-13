/** Setup the Mongoose connection **/
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

// mongoose.connect('mongodb://127.0.0.1:27017/class_activity_db');

module.exports = mongoose.connection;