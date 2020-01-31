var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ttt1', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model(
  'users',
  {
    name: String,
    grade: Number
  }
);

router.get('/', async function(req, res, next) {
  const users = await User.find();
  res.json(users);
});

router.post('/', async (req, res, next) => {
  var newUser = new User(req.body);

  try {
    const newUserResult = await newUser.save();
    res.json(newUserResult);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
