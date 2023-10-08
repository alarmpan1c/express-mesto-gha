require('dotenv').config();
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const express = require('express');
const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');
const { NOT_FOUND } = require('./utils/constants');
const { login } = require('./controllers/users');
const { makeUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorDes = require('./middlewares/errorsDes');
const { loginValid, registerValid } = require('./middlewares/validation');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});
app.use(express.json());
app.use(express.urlencoded());

app.post('/signin', loginValid, login);
app.post('/signup', registerValid, makeUser);
app.use('/users', auth, usersRout);
app.use('/cards', auth, cardsRout);
app.use('*', (req, res) => (
  res.status(NOT_FOUND).send({ message: 'Не найдено' })
));

app.use(errors());
app.use(errorDes);
app.listen(3000, () => console.log('You here'));
