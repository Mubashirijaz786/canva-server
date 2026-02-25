const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/:pageName', seoController.getSEOByPage);
router.put('/', verifyJWT, authorizeRoles('admin', 'superadmin'), upload.single('ogImage'), seoController.updateSEO);

module.exports = router;