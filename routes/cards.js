const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

function checkCardId() {
  return celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24),
    }),
  });
}

router.put('/:cardId/likes', checkCardId(), likeCard);
router.delete('/:cardId/likes', checkCardId(), dislikeCard);
router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?\w+#?/),
  }),
}), createCard);

module.exports = router;
