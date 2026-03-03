
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');




router.get('/', faqController.getFAQs);


router.post('/', faqController.createFAQ); 
router.delete('/:id', faqController.deleteFAQ);

module.exports = router; 