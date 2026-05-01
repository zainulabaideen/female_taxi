const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// All admin routes protected by admin JWT
router.use(verifyAdmin);

// Dashboard
router.get('/dashboard', adminCtrl.getDashboard);

// Users
router.get('/users', adminCtrl.getAllUsers);
router.put('/users/:userId/status', adminCtrl.updateUserStatus);
router.delete('/users/:userId', adminCtrl.deleteUser);

// Driver approvals
router.get('/drivers/pending', adminCtrl.getPendingDrivers);
router.put('/drivers/:driverId/review', adminCtrl.reviewDriver);

// Bookings
router.get('/bookings', adminCtrl.getAllBookings);

// Reports
router.get('/reports', adminCtrl.getAllReports);
router.put('/reports/:reportId/status', adminCtrl.updateReportStatus);

// SOS
router.get('/sos', adminCtrl.getAllSOS);
router.put('/sos/:sosId/resolve', adminCtrl.resolveSOS);

module.exports = router;
