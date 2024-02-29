const express = require('express');
const router = express.Router();
const userController = require('../controllers/registerController');

router.route('/').post(userController.newUserRegistration);

module.exports = router;