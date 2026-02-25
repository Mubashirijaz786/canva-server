const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    iconName: { type: String, required: true }, // Lucide icon name (e.g., 'Code')
    link: { type: String, default: '/services' },
    color: { type: String, default: 'blue' }, // For dynamic glow effect
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);