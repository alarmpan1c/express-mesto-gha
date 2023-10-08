const usersRout = require('express').Router();
const { getAllUsers } = require('../controllers/users');
const { getUserId } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { infoUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');
const { userValid, userIdValid, avatarValid } = require('../middlewares/validation');

usersRout.get('/me', infoUser);

usersRout.get('/', getAllUsers);

usersRout.get('/:userId', userIdValid, getUserId);

usersRout.patch('/me', userValid, updateProfile);

usersRout.patch('/me/avatar', avatarValid, updateAvatar);

module.exports = usersRout;
