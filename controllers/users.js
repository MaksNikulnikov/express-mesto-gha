const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const data = {};
  if (name !== undefined) {
    data.name = name;
  }
  if (about !== undefined) {
    data.about = about;
  }
  User.findByIdAndUpdate(
    req.user._id,
    data,
    { new: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { link } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: link },
    { new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};
