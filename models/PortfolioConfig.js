const mongoose = require('mongoose');

const portfolioConfigSchema = new mongoose.Schema({
    badgeText: { type: String, default: "Selected Works 2024-2026" },
    heroTitle: { type: String, default: "We Don't Just Write Code." },
    herosubtitle: { type: String, default: "We Build Legacies." },
    heroDescription: { type: String, default: "Explore a curated selection of our finest work. From enterprise-grade software to award-winning creative campaigns." },
    stats: [{
        number: { type: String }, 
        label: { type: String }
    } ]
}, { timestamps: true });

module.exports = mongoose.model('PortfolioConfig', portfolioConfigSchema);