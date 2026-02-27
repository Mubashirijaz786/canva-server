const express = require('express');
const router = express.Router();
const controller = require('../controllers/whyChooseUsController');
const { upload } = require('../middleware/uploadMiddleware');
const verifyJWT = require('../middleware/authMiddleware');

router.get('/', controller.getWhyChooseUsData);

router.post('/card', verifyJWT, controller.addCard);
router.delete('/card/:id', verifyJWT, controller.deleteCard);

router.put('/image', verifyJWT, upload.single('image'), controller.updateGlobalImage);

module.exports = router;