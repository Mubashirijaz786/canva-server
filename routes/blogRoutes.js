const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
// ✅ Object mein se 'upload' ko nikalna lazmi hai
const { upload } = require('../middleware/uploadMiddleware');
const verifyJWT = require('../middleware/authMiddleware');

// Sab routes ko check karo
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected Routes
router.post('/', verifyJWT, upload.any(), blogController.createBlog);
router.delete('/:id', verifyJWT, blogController.deleteBlog);
router.put('/:id', verifyJWT, upload.any(), blogController.updateBlog);
router.get('/slug/:slug', blogController.getBlogBySlug);

module.exports = router;