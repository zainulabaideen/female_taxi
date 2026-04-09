const express = require('express');
const { login, getAdminDashboard,registerAdmin } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/login', login);
router.post('/signup', registerAdmin);
router.get('/admin/dashboard', verifyToken, getAdminDashboard);

module.exports = router;