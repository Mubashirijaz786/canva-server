const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, 
    desc: { type: String, required: true },
    image: { type: String, required: true }, 
    link: { type: String, default: "" }, 
    link: { type: String, default: "" },
    tags: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);