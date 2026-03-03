const express = require('express');
const router = express.Router();
const servicePageController = require('../controllers/servicePageController');

const { upload } = require('../middleware/uploadMiddleware'); 
const verifyJWT = require('../middleware/authMiddleware'); 


router.get('/:pageId', servicePageController.getPageData);



router.put('/:pageId', verifyJWT, upload.single('heroImage'), servicePageController.updatePageData);

module.exports = router;