const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// 1. Handle New Inquiry (Form Submit)
exports.handleInquiry = async (req, res) => {
    try {
        const { name, email, phone, budget, service, message } = req.body;
        
        // ✅ Cloudinary Middleware use karne ki wajah se URL humein 'req.file.path' mein milega
        const fileUrl = req.file ? req.file.path : null;
        const fileName = req.file ? req.file.originalname : "No Attachment";

        // 2. Database mein Inquiry save karo (attachmentUrl field lazmi add karein model mein)
        const newInquiry = await Inquiry.create({
            name, 
            email, 
            phone, 
            budget, 
            service, 
            message,
            attachmentUrl: fileUrl, // Database mein link save ho raha hai
            attachmentName: fileName
        });

        // 3. Professional Email Template (With Cloudinary Link)
        const htmlContent = `
            <div style="font-family: sans-serif; border: 1px solid #e5e7eb; padding: 25px; border-radius: 15px; max-width: 600px;">
                <h2 style="color: #2563eb; margin-bottom: 20px;">🚀 New Project Inquiry</h2>
                <p>You have received a new message from <strong>Canva Solutions</strong> website.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Budget:</strong> $${budget || 'N/A'}</p>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-top: 15px;">
                    <strong>Message:</strong><br/>
                    <p style="white-space: pre-wrap; color: #374151;">${message}</p>
                </div>
                
                ${fileUrl ? `
                    <div style="margin-top: 25px; padding: 15px; background: #f0fdf4; border: 1px dashed #16a34a; border-radius: 10px; text-align: center;">
                        <p style="margin-bottom: 10px; color: #166534; font-weight: bold;">📎 Attachment: ${fileName}</p>
                        <a href="${fileUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            View / Download File
                        </a>
                    </div>
                ` : '<p style="margin-top: 20px; color: #6b7280; font-style: italic;">No attachment included.</p>'}
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">Inquiry details are also available on your Admin Dashboard.</p>
            </div>
        `;

        // 4. Email bhejein (Ab koi size error nahi aayega!)
        await sendEmail({
            email: process.env.SENDER_EMAIL || "mubashirejaz786@gmail.com",
            subject: `New Inquiry: ${name} (${service})`,
            html: htmlContent
            // Note: Hum ab 'attachments' array nahi bhej rahe taake Brevo block na kare
        });

        res.status(201).json({ 
            success: true, 
            message: "Inquiry submitted successfully! Notification sent to email.",
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
        const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status: 'read' }, { new: true });
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

// 5. Update Status (Resolved/Pending etc)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updatedInquiry });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};