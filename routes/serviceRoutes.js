const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { upload } = require('../middleware/uploadMiddleware'); 
const verifyJWT = require('../middleware/authMiddleware'); 


router.get('/', serviceController.getServices);



router.put('/', verifyJWT, upload.any(), serviceController.updateServices);

module.exports = router;