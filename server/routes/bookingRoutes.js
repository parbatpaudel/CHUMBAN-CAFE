const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.get('/slots', bookingController.getTimeSlots);
router.get('/tables', bookingController.getAvailableTables);
router.post('/reserve', bookingLimiter, bookingController.createReservation);

module.exports = router;