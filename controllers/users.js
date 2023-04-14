const mongoose = require('mongoose');
const User = require('../models/user');
const status = require('../constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(status.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(status.BAD_REQUEST).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(status.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const data = { name, about };
  User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(status.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(status.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};
module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(status.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(status.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};
