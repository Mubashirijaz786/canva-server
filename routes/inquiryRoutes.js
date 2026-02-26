const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer'); 
const inquiryController = require('../controllers/contactController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.post('/', upload.single('attachment'), inquiryController.handleInquiry);

router.get('/', verifyJWT, authorizeRoles('admin', 'superadmin'), inquiryController.getAllInquiries);

router.patch('/:id/read', verifyJWT, authorizeRoles('admin', 'superadmin'), inquiryController.markAsRead);

router.delete('/:id', verifyJWT, authorizeRoles('superadmin'), inquiryController.deleteInquiry);

module.exports = router;