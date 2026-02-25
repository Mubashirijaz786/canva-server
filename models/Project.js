const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Web Development"
    desc: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    link: { type: String, default: "" }, // Project Live Link
    link: { type: String, default: "" },
    tags: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);