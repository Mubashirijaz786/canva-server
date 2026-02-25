const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    pageName: { type: String, required: true, unique: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SEO', seoSchema);