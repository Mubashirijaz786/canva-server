const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Inquiry = require('../models/Inquiry');

router.get('/dashboard', async (req, res) => {
    try {
        const [blogCount, projectCount, teamCount, unreadInquiries, unreadCount] = await Promise.all([
            Blog.countDocuments(),
            Project.countDocuments(),
            Team.countDocuments(),
            
            Inquiry.find({ status: 'unread' }).sort({ createdAt: -1 }), 
            
            Inquiry.countDocuments({ status: 'unread' }) 
        ]);

        res.json({
            success: true,
            stats: {
                blogs: blogCount,
                projects: projectCount,
                team: teamCount,
                inquiries: unreadCount 
            },
            recentInquiries: unreadInquiries 
        });
    } catch (err) {
        console.error("❌ Stats Fetch Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;