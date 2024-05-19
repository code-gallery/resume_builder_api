const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");



router.get('/users', auth, userController.getUsers);
router.get('/', auth, userController.getUser);
router.get('/profile', auth, userController.profile);
router.post('/save', auth, upload.single('profileimage'), userController.save);

//User Credit
router.post('/userCredit/add', userController.addEditUserCredit);



module.exports = router;