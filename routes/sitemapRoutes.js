const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/SitemapController');
const verifyJWT = require('../middleware/authMiddleware');

// Dashboard Master Route
router.get('/generate-full', verifyJWT, sitemapController.downloadFullSitemap);

module.exports = router;