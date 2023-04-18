const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  autoIndex: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use('/', require('./routes/index'));

app.use(errors());
app.use(require('./middlewares/errors'));

app.listen(PORT, () => {
});
