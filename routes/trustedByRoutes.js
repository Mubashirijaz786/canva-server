const express = require('express');
const router = express.Router();
const trustedByController = require('../controllers/trustedByController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const trustedUpload = upload.fields([
    { name: 'sideImage', maxCount: 1 },
    { name: 'logos', maxCount: 20 }
]);

router.get('/', trustedByController.getTrustedData);
router.put('/', verifyJWT, authorizeRoles('admin', 'superadmin'), trustedUpload, trustedByController.updateTrustedData);

module.exports = router;