const express = require('express');
const router = express.Router();
const servicePageController = require('../controllers/servicePageController');

const { upload } = require('../middleware/uploadMiddleware'); // Cloudinary/Multer setup
const verifyJWT = require('../middleware/authMiddleware'); // Admin access check

// ✅ Public Route: Frontend data fetch karne ke liye
router.get('/:pageId', servicePageController.getPageData);

// ✅ Admin Protected Route: Data aur Image update karne ke liye
// 'heroImage' wahi field name hona chahiye jo frontend FormData mein append ho raha hai
router.put('/:pageId', verifyJWT, upload.single('heroImage'), servicePageController.updatePageData);

module.exports = router;