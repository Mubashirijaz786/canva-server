const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    emails: { type: [String], default: ["info@canvasolutions.co.uk"] },
    phones: { type: [String], default: ["+1 737 443 6352"] },
    addresses: { type: [String], default: ["5900 Balcones Drive #29017 Austin, TX, 78731, USA"] },
    
    // ✅ NEW GLOBAL LINKS
    calendlyLink: { type: String, default: "https://calendly.com/canvasolutions-info/" },
    whatsappNumber: { type: String, default: "17374436352" }, // Bina '+' ke save karein
    whatsappMessage: { type: String, default: "Hello! I'm interested in your services." },
    
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    upwork: { type: String, default: "" },
    copyright: { type: String, default: "2026" }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);