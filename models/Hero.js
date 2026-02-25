const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    badgeText: { type: String, default: "IT SOLUTION COMPANY 2025" },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String },
    
    statsText: { type: String, default: "We’re Canva Solutions — the AI-fueled digital agency." },
    happyClientsCount: { type: String, default: "100+" },
    clientImages: [{ type: String }] // Array of image URLs
}, { timestamps: true });
module.exports = mongoose.model('Hero', heroSchema);