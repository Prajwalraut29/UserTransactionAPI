const express = require('express')
const { getTransactionsForUser } = require('../controllers/transactionController')
const { getAllTransactionsWithUserDetails } = require('../controllers/transactionController')
const router = express.Router()

router.get('/:userId/transactions', getTransactionsForUser)
router.get('/transactions', getAllTransactionsWithUserDetails);

module.exports = router