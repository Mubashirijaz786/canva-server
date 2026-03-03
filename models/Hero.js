const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    badgeText: { type: String, default: "IT SOLUTION COMPANY 2025" },
    heading: { type: String, default: "Transforming Ideas into Online Success", required: true },
    description: { type: String, default: "At Canva Solutions, our expert digital services are powered by cutting-edge tools.", required: true },
    videoUrl: { type: String },
    
    statsText: { type: String, default: "We’re Canva Solutions — the AI-fueled digital agency." },
    happyClientsCount: { type: String, default: "100+" },
    clientImages: [{ type: String }] 
}, { timestamps: true });
module.exports = mongoose.model('Hero', heroSchema);