const express = require('express');
const router = express.Router();
const userAuth = require('../controllers/authController');

router.route('/').post(userAuth.authUser);


module.exports = router;