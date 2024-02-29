const express = require('express');
const router = express.Router();
const refreshToken = require('../controllers/refreshTokenController');

router.route('/').get(refreshToken.handleRefreshToken);


module.exports = router;