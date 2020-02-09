var express = require('express');
const UserModel = require('../models/Users');
var router = express.Router();

router.post('/', async (req, res) => {
  var newUser = new UserModel(req.body);

  try {
    const newUserResult = await newUser.save();
    // const users = await UserModel.find();

    // res.render('index', { title: 'Student Grade Table', users });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/', async function(req, res, next) {
  let { sort, dir } = req.query;
  dir = dir !== undefined ? dir : -1;
  let sortQuery = {};
    if (sort) {
      sortQuery[sort] = dir;
    }

  const users = await UserModel.find().sort(sortQuery);
  res.render('index', { title: 'Student Grade Table', users, sort, dir });
});

module.exports = router;
