const Card = require('../models/card');

module.exports.getCards = (res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так...' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так...' });
    });
};
