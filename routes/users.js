var express = require('express');
var router = express.Router();
const User = require('../models/Users');

router.get('/', async function(req, res, next) {
  const { sort, dir } = req.query;

  try {
    let sortQuery = {};
    if (sort) {
      sortQuery[sort] = dir;
    }

    const users = await User.find().sort(sortQuery);
    res.json(users);
  } catch (ex) {
    res.status(500).send(ex);
  }

});

router.post('/', async (req, res, next) => {
  var newUser = new User(req.body);

  try {
    const newUserResult = await newUser.save();
    res.status(201).json(newUserResult);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
