const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    author: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true 
    }, 
    quote: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        default: 5, 
        min: 1, 
        max: 5 
    },
    isFeatured: { 
        type: Boolean, 
        default: false 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);