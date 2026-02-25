const express = require('express');
const router = express.Router();
const controller = require('../controllers/heroController');
const verifyJWT = require('../middleware/authMiddleware');
// ✅ Object mein se 'upload' ko nikalna lazmi hai
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', controller.getHero);

router.put('/', verifyJWT, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'clientImages', maxCount: 5 }
]), controller.updateHero);

module.exports = router;