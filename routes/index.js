const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(6),
    password: Joi.string().required().min(8),
  }),
}), require('../controllers/users').login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(6),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), require('../controllers/users').createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', () => {
  throw Promise.reject(new NotFoundError('По указанному URL ничего нет'));
});

module.exports = router;
