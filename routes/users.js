var express = require('express');
var router = express.Router();



router.get('/', async function(req, res, next) {
  const { sort, dir } = req.query;

  try {
    let sortQuery = {};
    if (sort) {
      sortQuery[sort] = dir;
    }

    const users = await User.find().sort(sortQuery);
    res.render('index', { title: 'Student Grade Table', message: message, users: users });
  } catch (ex) {
    res.status(500).send(ex.message);
  }

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
