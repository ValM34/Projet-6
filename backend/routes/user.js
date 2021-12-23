const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/password-validator');
const emailValidator = require('../middleware/email-validator');

router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;