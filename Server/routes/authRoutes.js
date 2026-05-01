const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multer');

// Public routes
router.post('/login', auth.login);
router.post('/admin/login', auth.adminLogin);
router.post('/admin/setup', auth.createSuperAdmin); // One-time setup
router.post('/signup/passenger', auth.registerPassenger);

// Driver signup — requires CNIC images upload
router.post(
  '/signup/driver',
  upload.fields([
    { name: 'cnic_front', maxCount: 1 },
    { name: 'cnic_back', maxCount: 1 },
  ]),
  auth.registerDriver
);

// Protected
router.get('/me', verifyToken, auth.getMe);

module.exports = router;