const express = require('express');
const router = express.Router();
const portfolioConfigController = require('../controllers/portfolioController');
const verifyJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.get('/', portfolioConfigController.getPortfolioConfig);
router.put('/', verifyJWT, authorizeRoles('admin', 'superadmin'), portfolioConfigController.updatePortfolioConfig);

module.exports = router;