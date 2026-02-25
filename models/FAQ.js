const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 } // Taake aap upar neeche set kar saken
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);