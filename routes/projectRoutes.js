const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const { upload } = require('../middleware/uploadMiddleware');
router.get('/', projectController.getProjects);

// Sirf Admin/Superadmin ke liye
router.post('/', verifyJWT, authorizeRoles('admin', 'superadmin'), upload.single('image'), projectController.addProject);
router.put('/:id', verifyJWT, authorizeRoles('admin', 'superadmin'), upload.single('image'), projectController.updateProject);
router.delete('/:id', verifyJWT, authorizeRoles('superadmin'), projectController.deleteProject);

module.exports = router;