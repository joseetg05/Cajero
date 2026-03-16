const express = require('express');
const router = express.Router();
const atmController = require('../controllers/atmController');

router.post('/withdraw', atmController.withdraw);

module.exports = router;
