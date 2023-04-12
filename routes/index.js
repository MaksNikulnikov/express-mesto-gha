const router = require('express').Router();
const constants = require('../constants');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'По указанному url ничего нет.' });
});

module.exports = router;
