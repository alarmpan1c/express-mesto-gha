const usersRout = require('express').Router();
const { getAllUsers } = require('../controllers/users');
const { getUserId } = require('../controllers/users');
const { makeUser } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');

usersRout.get('/', getAllUsers);

usersRout.get('/:userId', getUserId);

usersRout.post('/', makeUser);

usersRout.patch('/me', updateProfile);

usersRout.patch('/me/avatar', updateAvatar);

module.exports = usersRout;
