const router = require('express').Router();
const { getCards, deleteCard, createCard } = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);

module.exports = router;
