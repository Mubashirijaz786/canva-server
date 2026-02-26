const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    budget: { type: String },
    service: { type: String },
    message: { type: String, required: true },
    attachmentUrl: { type: String }, 
    attachmentName: { type: String },
    status: { type: String, default: 'unread', enum: ['unread', 'read', 'resolved'] }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);