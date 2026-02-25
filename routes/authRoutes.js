const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJWT = require('../middleware/authMiddleware');

const authorizeRoles = require('../middleware/roleMiddleware');

router.post('/login', authController.login);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/add-admin', authController.addAdmin); // Naya route for adding admin
router.post('/send-admin-otp', verifyJWT, authController.sendAdminOTP);
router.post('/verify-admin', verifyJWT, authController.verifyAndAddAdmin);
router.get('/admins', verifyJWT, authorizeRoles('superadmin'), authController.getAllAdmins);
router.delete('/admin/:id', verifyJWT, authorizeRoles('superadmin'), authController.removeAdmin);

module.exports = router;