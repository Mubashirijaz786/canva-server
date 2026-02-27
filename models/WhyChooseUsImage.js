const mongoose = require('mongoose');

const whyChooseUsImageSchema = new mongoose.Schema({
    featureImage: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('WhyChooseUsImage', whyChooseUsImageSchema);