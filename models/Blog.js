const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, default: 'Editor in Chief' },
    readTime: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true }, 
    intro: { type: String, required: true },
    
    slug: { type: String, unique: true }, 
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    
    sections: [{
        heading: { type: String },
        text: { type: String },
        image: { type: String } 
    }],
}, { timestamps: true });

// ✅ MODERN SYNTAX (Removing 'next' to avoid "next is not a function" error)
blogSchema.pre('save', function() {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '') 
            .replace(/ +/g, '-');    
    }
    
    if (!this.metaTitle) {
        this.metaTitle = this.title;
    }
    
    // Yahan next() ki zaroorat nahi agar hum parameter nikal dein
});

module.exports = mongoose.model('Blog', blogSchema);