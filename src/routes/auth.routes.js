const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const authController = require('../controllers/auth.controller');

router.post('/login', [
// password must be at least 5 chars long
check('password','Please enter a password').exists(),
check('type','Please enter a type').exists(),
],
authController.authenticate);

router.post('/create-admin',  
check('email','Please enter a valid email').isEmail(),
// password must be at least 5 chars long
check('password','Please enter a password').exists(),
authController.signup);

//Forgot password
router.post('/resetPasswordMail', authController.forgotPassword);
router.post('/setPassword', authController.newPassword);

module.exports = router
