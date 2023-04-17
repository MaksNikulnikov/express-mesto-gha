const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', require('../controllers/users').login);
router.post('/signup', require('../controllers/users').createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', () => {
  throw Promise.reject(new NotFoundError('По указанному URL ничего нет'));
});

module.exports = router;
