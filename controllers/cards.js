const mongoose = require('mongoose');
const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.find(req.params.cardId)
    .then((card) => {
      if (!req.user._id === card.owner) {
        return Promise.reject(new UnauthorizedError('Вы не можете удалить эту карту'));
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка.'));
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner')
      .then((newCard) => res.send({ data: newCard })))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка.'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при снятии лайка.'));
      }
    });
};
