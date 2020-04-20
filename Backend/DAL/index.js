const {  MONGODB_URL} = require('../config.js');

const mongoose = require("mongoose");

const _connection = mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

module.exports = {
    connection : _connection
};