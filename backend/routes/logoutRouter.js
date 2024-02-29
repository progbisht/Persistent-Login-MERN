const express = require('express');
const router = express.Router();
const logout = require('../controllers/logoutController');

router.route('/').get(logout.handleLogout);


module.exports = router;