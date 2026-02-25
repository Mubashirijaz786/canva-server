const express = require('express');
const router = express.Router();
const controller = require('../controllers/whyChooseUsController');
const verifyJWT = require('../middleware/authMiddleware');
// ✅ Object mein se 'upload' ko nikalna lazmi hai
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', controller.getFeatures);
router.post('/', verifyJWT, upload.single('image'), controller.addFeature);
router.put('/:id', verifyJWT, upload.single('image'), controller.updateFeature);
router.delete('/:id', verifyJWT, controller.deleteFeature);

module.exports = router;