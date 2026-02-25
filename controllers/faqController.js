const FAQ = require('../models/FAQ');

// Get all FAQs
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ order: 1 });
        res.status(200).json(faqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer, order } = req.body;
        const newFAQ = await FAQ.create({ question, answer, order });
        res.status(201).json(newFAQ);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};