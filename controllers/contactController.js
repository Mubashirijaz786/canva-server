const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// 1. Handle New Inquiry (Form Submit)
exports.handleInquiry = async (req, res) => {
    try {
        const { name, email, phone, budget, service, message } = req.body;
        const file = req.file;

        // Database mein Inquiry save karo (Default status 'unread' hoga)
        const newInquiry = await Inquiry.create({
            name, email, phone, budget, service, message
        });

        const attachments = [];
        if (file) {
            attachments.push({
                filename: file.originalname,
                content: file.buffer 
            });
        }

        const htmlContent = `
            <div style="font-family: sans-serif; border: 1px solid #e5e7eb; padding: 25px; border-radius: 15px;">
                <h2 style="color: #2563eb;">🚀 New Project Inquiry</h2>
                <p>You have received a new message from your website contact form.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Budget:</strong> $${budget || 'N/A'}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p style="background: #f9fafb; padding: 15px; border-radius: 10px;">
                    <strong>Message:</strong><br/>${message}
                </p>
                ${file ? `<p style="color: #059669;">📎 <strong>Attachment included:</strong> ${file.originalname}</p>` : ''}
            </div>
        `;

        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: `New Inquiry: ${name} (${service})`,
            html: htmlContent,
            attachments: attachments
        });

        res.status(201).json({ 
            success: true, 
            message: "Inquiry submitted successfully!",
            data: newInquiry 
        });

    } catch (err) {
        console.error("❌ INQUIRY ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Get All Inquiries (Admin Inbox)
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: inquiries });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            id, 
            { status: 'read' }, // ✅ Status 'read' kar rahe hain
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedInquiry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Delete Inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await Inquiry.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // frontend se 'read' ya 'resolved' aayega

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        
        res.status(200).json({ success: true, data: updatedInquiry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};