const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    iconName: { type: String, required: true }, 
    link: { type: String, default: '/services' },
    color: { type: String, default: 'blue' }, 
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);