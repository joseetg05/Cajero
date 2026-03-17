const express = require('express');
const router = express.Router();
const atmController = require('../controllers/atmController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/withdraw', atmController.withdraw);
router.post('/deposit', atmController.deposit);
router.get('/transactions', authMiddleware, atmController.getTransactions);

module.exports = router;
