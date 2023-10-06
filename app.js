const mongoose = require('mongoose');
const express = require('express');
const usersRout = require('./routes/users');
const cardsRout = require('./routes/cards');
const { NOT_FOUND } = require('./utils/constants');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use(express.urlencoded());

app.use((req, res, next) => {
  req.user = {
    _id: '651ec014f87113a1a694249a', // вставьте сюда _id созданного в предыдущем пункте пользователя };
  };
  next();
});

app.use('/users', usersRout);
app.use('/cards', cardsRout);
app.use('*', (req, res) => (
  res.status(NOT_FOUND).send({ message: 'Не найдено' })
));

app.listen(3000, () => console.log('You here'));
