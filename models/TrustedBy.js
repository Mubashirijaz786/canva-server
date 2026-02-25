const mongoose = require('mongoose');

const trustedBySchema = new mongoose.Schema({
    topText: { type: String, default: "More than 100+ companies trust us worldwide" },
    logos: [{ type: String }], 
    badgeText: { type: String, default: "More About Our Company" },
    heading: { type: String, default: "All-in-One Service Provider" },
    sideImage: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('TrustedBy', trustedBySchema);