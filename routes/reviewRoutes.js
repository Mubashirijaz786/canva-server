const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', reviewController.getReviewsData);

router.put('/branding-image', verifyJWT, authorizeRoles('admin', 'superadmin'), upload.single('image'), reviewController.updateBrandingImage);

router.post('/', verifyJWT, authorizeRoles('admin', 'superadmin'), reviewController.addReview);

router.put('/:id', verifyJWT, authorizeRoles('admin', 'superadmin'), reviewController.updateReview);

router.delete('/:id', verifyJWT, authorizeRoles('admin', 'superadmin'), reviewController.deleteReview);

module.exports = router;