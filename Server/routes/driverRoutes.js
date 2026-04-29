const express = require('express');
const router = express.Router();
const driverCtrl = require('../controllers/driverController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All driver routes require authentication
router.use(verifyToken);

// Driver profile (driver only)
router.get('/profile', requireRole('driver'), driverCtrl.getProfile);
router.put('/profile', requireRole('driver'), driverCtrl.updateProfile);

// ─── Availability Management (Date-Based) ────────────────────────────────
router.get('/availability', requireRole('driver'), driverCtrl.getAvailability);
router.post('/availability', requireRole('driver'), driverCtrl.addAvailability);
router.delete('/availability/:slotId', requireRole('driver'), driverCtrl.deleteAvailability);

// ─── Pricing Management ───────────────────────────────────────────────────
router.get('/rates', requireRole('driver'), driverCtrl.getRates);
router.put('/rates', requireRole('driver'), driverCtrl.setRates);
router.get('/discounts', requireRole('driver'), driverCtrl.getDiscounts);
router.post('/discounts', requireRole('driver'), driverCtrl.addDiscount);
router.delete('/discounts/:discountId', requireRole('driver'), driverCtrl.removeDiscount);

// ─── Ride Offers (Bidding System) ─────────────────────────────────────────
router.get('/offers/incoming', requireRole('driver'), driverCtrl.getIncomingOffers);
router.get('/offers/active', requireRole('driver'), driverCtrl.getActiveOffers);
router.post('/offers/create', requireRole('driver'), driverCtrl.createOffer);
router.post('/offers/:offerId/respond', requireRole('driver'), driverCtrl.respondToOffer);

// ─── Active Ride Management ──────────────────────────────────────────────
router.post('/ride/:bookingId/start', requireRole('driver'), driverCtrl.startDriving);
router.post('/ride/:bookingId/done', requireRole('driver'), driverCtrl.doneDriving);
router.post('/ride/:bookingId/location', requireRole('driver'), driverCtrl.updateLocation);

// Public driver list (passengers view)
router.get('/all', requireRole('passenger'), driverCtrl.getAllDrivers);

// Available sub-slots for a specific driver (passengers)
router.get('/:driverId/available-slots', requireRole('passenger'), driverCtrl.getDriverSlots);

module.exports = router;
