const mongoose = require('mongoose');

const servicePageSchema = new mongoose.Schema({
    pageId: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    
    
    badgeText: { type: String },      
    heroTitle: { type: String },
    heroSubtitle: { type: String }, 
    heroDescription: { type: String }, 
    heroImage: { type: String },       

    
    contentItems: [{
        title: { type: String },
        description: { type: String },
        iconName: { type: String, default: 'Zap' }, 
        image: { type: String }     
    }],

    
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],

    
    checklist: [String], 
    reasons: [{
        title: String,
        description: String
    }],

    
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('ServicePage', servicePageSchema);