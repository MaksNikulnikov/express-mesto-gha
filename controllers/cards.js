const Card = require('../models/card');
const status = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(status.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner')
      .then((newCard) => res.send({ data: newCard })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(status.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(status.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        res.status(status.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(status.INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так...' });
    });
};