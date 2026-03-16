const express = require('express');
const router = express.Router();
const atmController = require('../controllers/atmController');

router.post('/withdraw', atmController.withdraw);
router.post('/deposit', atmController.deposit);

module.exports = router;
