const mongoose = require('mongoose');

const servicePageSchema = new mongoose.Schema({
    pageId: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    
    // ✅ HERO SECTION (UPDATED)
    badgeText: { type: String },      
    heroTitle: { type: String },
    heroSubtitle: { type: String }, 
    heroDescription: { type: String }, 
    heroImage: { type: String },       

    // Dynamic Lists
    contentItems: [{
        title: { type: String },
        description: { type: String },
        iconName: { type: String, default: 'Zap' }, 
        image: { type: String }     
    }],

    // FAQ Section
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],

    // ✅ CHECKLIST & REASONS
    checklist: [String], 
    reasons: [{
        title: String,
        description: String
    }],

    // SEO Meta Data
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('ServicePage', servicePageSchema);