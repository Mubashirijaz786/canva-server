const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

const { upload } = require('../middleware/uploadMiddleware');
const verifyJWT = require('../middleware/authMiddleware'); 

router.get('/', aboutController.getAboutData);
router.put('/', verifyJWT, upload.any(), aboutController.updateAboutData);

module.exports = router;