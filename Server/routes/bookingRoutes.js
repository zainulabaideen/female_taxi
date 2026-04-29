const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controllers/bookingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Passenger actions
router.post('/', requireRole('passenger'), bookingCtrl.createBooking);
router.get('/my', requireRole('passenger'), bookingCtrl.getMyBookings);
router.put('/:bookingId/cancel', requireRole('passenger'), bookingCtrl.cancelBooking);

// Ride Offers (Bidding System)
router.post('/offers/request', requireRole('passenger'), bookingCtrl.requestOffers);
router.get('/offers/my', requireRole('passenger'), bookingCtrl.getMyOffers);
router.post('/offers/:offerId/accept', requireRole('passenger'), bookingCtrl.acceptOffer);

// Driver actions
router.get('/driver', requireRole('driver'), bookingCtrl.getDriverBookings);
router.put('/:bookingId/status', requireRole('driver'), bookingCtrl.updateStatus);

// Both can view a single booking
router.get('/:bookingId', bookingCtrl.getBookingById);

module.exports = router;
