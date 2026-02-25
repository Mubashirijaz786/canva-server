const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.get('/', settingsController.getSettings);
router.put('/', verifyJWT, authorizeRoles('superadmin' , 'admin'), settingsController.updateSettings);

module.exports = router;