const usersRout = require('express').Router();
const { getAllUsers } = require('../controllers/users');
const { getUserId } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { infoUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');

usersRout.get('/me', infoUser);

usersRout.get('/', getAllUsers);

usersRout.get('/:userId', getUserId);

usersRout.patch('/me', updateProfile);

usersRout.patch('/me/avatar', updateAvatar);

module.exports = usersRout;
