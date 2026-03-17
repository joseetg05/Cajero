const express = require('express');
const router = express.Router();
const atmController = require('../controllers/atmController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/withdraw', authMiddleware, atmController.withdraw);
router.post('/deposit', authMiddleware, atmController.deposit);
router.get('/transactions', authMiddleware, atmController.getTransactions);
router.get('/balance', authMiddleware, atmController.getBalance);
router.get('/client-info', authMiddleware, atmController.getClientInfo);

module.exports = router;
