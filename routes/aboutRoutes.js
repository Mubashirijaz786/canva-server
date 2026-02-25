const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
// ✅ Object mein se 'upload' ko nikalna lazmi hai
const { upload } = require('../middleware/uploadMiddleware');
const verifyJWT = require('../middleware/authMiddleware'); 

router.get('/', aboutController.getAboutData);
router.put('/', verifyJWT, upload.any(), aboutController.updateAboutData);

module.exports = router;