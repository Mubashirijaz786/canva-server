const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
   
    badgeText: { 
        type: String, 
        default: "About Canva Solutions" 
    },
    heroTitle: { type: String, default: "Innovating the" },
    heroSubtitle: { type: String, default: "Digital Future." },
    heroDescription: { type: String, default: "We are a collective of dreamers, builders, and strategists. We don't just build software; we build the engines that power the next generation of businesses." },
    heroImage: { type: String }, 

    
    stats: [{
        number: { type: String }, 
        label: { type: String },  
        iconName: { type: String } 
    }],

    
    founderMainTitle: { 
        type: String, 
        default: "Meet the Founder" 
    },
    founderName: { type: String },
    founderRole: { type: String },
    founderImage: { type: String },
    founderVision: { type: String, default: "To build reliable, scalable, and performance-driven digital solutions that help businesses grow with confidence." },
    
  
    founderSections: [{
        title: { type: String },
        description: { type: String }
    }],


    valuesTitle: { 
        type: String, 
        default: "Our Core Values" 
    },
    valuesSubtitle: { 
        type: String, 
        default: "Driven by Excellence" 
    },
    valuesList: [{
        title: { type: String },
        description: { type: String },
        iconName: { type: String }
    }]

    
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);