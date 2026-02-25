const mongoose = require('mongoose');

const reviewImageSchema = new mongoose.Schema({
    brandingImage: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('ReviewImage', reviewImageSchema);