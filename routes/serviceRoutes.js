const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { upload } = require('../middleware/uploadMiddleware'); // Aapka middleware
const verifyJWT = require('../middleware/authMiddleware'); // Admin protection

// ✅ Public Route: Services get karne ke liye
router.get('/', serviceController.getServices);

// ✅ Admin Route: Services update karne ke liye
// upload.any() isliye use kar rahe hain kyunki aapka ManageAbout bhi isi style mein hai
router.put('/', verifyJWT, upload.any(), serviceController.updateServices);

module.exports = router;