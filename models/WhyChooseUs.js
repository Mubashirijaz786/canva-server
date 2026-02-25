const mongoose = require('mongoose');

const whyChooseUsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Sparkles' }, // Lucide icon ka naam string mein save hoga
    image: { type: String }, // Global image (sirf featured card mein save hogi)
    isFeatured: { type: Boolean, default: false } // Image hamesha featured card se uthayenge
}, { timestamps: true });

module.exports = mongoose.model('WhyChooseUs', whyChooseUsSchema);