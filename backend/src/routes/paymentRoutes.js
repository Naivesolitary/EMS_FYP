const express = require('express')
const router = express.Router()
const {verifyPayment} = require('../controllers/paymentController')
const {booking_id,paymentId} = require('../controllers/bookingController')
const {} = require('../models/bookingModel')
// router.post('/esewa',)
router.get('/verify-esewa/:transaction_uuid',verifyPayment)
router.get('/booking-id/:id',booking_id)
router.get('/payment-id/:id',paymentId)
// router.get('/success')
// router.get('/failure')

module.exports = router;