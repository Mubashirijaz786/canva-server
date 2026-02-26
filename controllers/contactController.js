const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// 1. Handle New Inquiry (Form Submit)
exports.handleInquiry = async (req, res) => {
    try {
        const { name, email, phone, budget, service, message } = req.body;
        const file = req.file;

        // Database mein Inquiry save karo
        const newInquiry = await Inquiry.create({
            name, email, phone, budget, service, message
        });

        // --- FILE ATTACHMENT LOGIC FOR BREVO API ---
        const attachments = [];
        if (file) {
            // Brevo API buffer nahi, Base64 mangti hai
            attachments.push({
                content: file.buffer.toString('base64'), 
                name: file.originalname
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
                ${file ? `<p style="color: #059669;">📎 <strong>Attachment:</strong> ${file.originalname} (Attached to this email)</p>` : ''}
            </div>
        `;

        // Email bhejein
        await sendEmail({
            // ✅ Hamesha SENDER_EMAIL use karein (mubashirejaz786@gmail.com)
            email: process.env.SENDER_EMAIL || "mubashirejaz786@gmail.com",
            subject: `New Inquiry: ${name} (${service})`,
            html: htmlContent,
            attachments: attachments // Base64 formatted array
        });

        res.status(201).json({ 
            success: true, 
            message: "Inquiry submitted successfully with attachment!",
            data: newInquiry 
        });

    } catch (err) {
        console.error("❌ INQUIRY ERROR:", err.message);
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

// 3. Mark As Read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            id, 
            { status: 'read' }, 
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

// 5. Update Status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

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