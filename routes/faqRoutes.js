// routes/faqRoutes.js (Testing version)
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Middlewares ko abhi comment kardo taake server start ho jaye
// const { protect, admin } = require('../middleware/authMiddleware'); 

router.get('/', faqController.getFAQs);

// Direct controller call karo (Testing ke liye)
router.post('/', faqController.createFAQ); 
router.delete('/:id', faqController.deleteFAQ);

module.exports = router; 