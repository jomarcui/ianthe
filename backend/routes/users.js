const router = require('express').Router();
let users = require('../models/users.model');

router.route('/').get((_req, res) => {
  users
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { dateCreated, email, lastLogin, password, username } = req.body;

  const newUser = new users({
    dateCreated,
    email,
    lastLogin,
    password,
    username,
  });

  newUser
    .save()
    .then((_user) => res.json('New user added.'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
  const { id } = req.params;

  users
    .findById(id)
    .then((user) => {
      const { dateCreated, email, lastLogin, password, username } = req.body;

      user.dateCreated = dateCreated;
      user.email = email;
      user.lastLogin = lastLogin;
      user.password = password;
      user.username = username;

      user
        .save()
        .then((_user) => res.json('User was updated.'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/:id').get((req, res) => {
  const { id } = req.params;

  users
    .findById(id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/:id').delete((req, res) => {
  const { id } = req.params;

  users
    .findByIdAndDelete(id)
    .then((user) => res.json('User was deleted.'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/auth').post(async (req, res) => {
  await users
    .findOne({ email: req.body.email, password: req.body.password })
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
