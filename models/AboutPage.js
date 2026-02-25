const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
    // --- Hero Section ---
    badgeText: { 
        type: String, 
        default: "About Canva Solutions" 
    },
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    heroDescription: { type: String },
    heroImage: { type: String }, // Cloudinary URL

    // --- Stats Section ---
    stats: [{
        number: { type: String }, 
        label: { type: String },  
        iconName: { type: String } 
    }],

    // --- Founder Section ---
    founderMainTitle: { 
        type: String, 
        default: "Meet the Founder" 
    },
    founderName: { type: String },
    founderRole: { type: String },
    founderImage: { type: String },
    founderVision: { type: String },
    
    // About Story / Mission Blocks
    founderSections: [{
        title: { type: String },
        description: { type: String }
    }],

    // --- Core Values ---
    valuesTitle: { 
        type: String, 
        default: "Our Core Values" 
    },
    valuesSubtitle: { 
        type: String, 
        default: "Driven by Excellence" 
    },
    valuesList: [{
        title: { type: String },
        description: { type: String },
        iconName: { type: String }
    }]

    
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);