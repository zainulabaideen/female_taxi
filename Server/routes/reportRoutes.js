const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Reports (any authenticated user)
router.post('/', reportCtrl.createReport);
router.get('/my', reportCtrl.getMyReports);

// SOS (passengers only — but verifyToken is enough)
router.post('/sos', reportCtrl.triggerSOS);
router.get('/sos/my', reportCtrl.getMySOS);

module.exports = router;
