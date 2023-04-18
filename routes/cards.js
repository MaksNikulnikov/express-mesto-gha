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

router.get('/', getCards);
router.delete('/:cardId', checkCardId(), deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', checkCardId(), likeCard);
router.delete('/:cardId/likes', checkCardId(), dislikeCard);

module.exports = router;
