const mongoose = require('mongoose');

const whyChooseUsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Sparkles' }, 
    image: { type: String }, 
    isFeatured: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('WhyChooseUs', whyChooseUsSchema);