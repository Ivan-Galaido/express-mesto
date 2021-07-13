const User = require('../models/user');

const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send(err));
};

const getProfile = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id профиля' });
      }
      res.status(500).send(err);
    });
};

const createUser = (req, res) => {
  const data = { ...req.body };
  User.create(data)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные не прошли валидацию' });
      }
      res.status(500).send(err);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные не прошли валидацию' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id профиля' });
      }
      res.status(500).send(err);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = { ...req.body };

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные не прошли валидацию' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id профиля' });
      }
      res.status(500).send(err);
    });
};

module.exports = {
  getUsers, getProfile, createUser, updateUser, updateAvatar,
};
