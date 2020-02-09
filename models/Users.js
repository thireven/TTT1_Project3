const mongoose = require('mongoose');
const User = mongoose.model(
  'users',
  {
    name: String,
    grade: Number
  }
);

module.exports = User;