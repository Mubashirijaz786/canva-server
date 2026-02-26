const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware'); 

// 1. Handle New Inquiry (Form Submit)
exports.handleInquiry = async (req, res) => {
    try {
        const { name, email, phone, budget, service, message } = req.body;
        
        // Cloudinary se link aur original name handle karein
        const fileUrl = req.file ? req.file.path : null;
        const fileName = req.file ? req.file.originalname : null;

        // Inquiry Database mein save karein
        const newInquiry = await Inquiry.create({
            name, 
            email, 
            phone, 
            budget, 
            service, 
            message,
            attachmentUrl: fileUrl,
            attachmentName: fileName
        });

        // Email Template Design
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
                            View File
                        </a>
                    </div>
                ` : '<p style="margin-top: 20px; color: #6b7280; font-style: italic;">No attachment included.</p>'}
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">Inquiry details are available on your Admin Dashboard.</p>
            </div>
        `;

        // Email bhejein (Try-Catch taake agar email fail ho to controller crash na kare)
        try {
            await sendEmail({
                email: process.env.SENDER_EMAIL || "mubashirejaz786@gmail.com",
                subject: `New Inquiry: ${name} (${service})`,
                html: htmlContent
            });
        } catch (emailErr) {
            console.error("❌ Email Error:", emailErr.message);
        }

        res.status(201).json({ 
            success: true, 
            message: "Inquiry submitted successfully!", 
            data: newInquiry 
        });

    } catch (err) {
        console.error("❌ Handle Inquiry Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Get All Inquiries (Admin Dashboard)
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
        const updated = await Inquiry.findByIdAndUpdate(id, { status: 'read' }, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Delete Inquiry (With Automatic Cloudinary Cleanup)
exports.deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Pehle inquiry check karein taake attachment URL mil sake
        const inquiry = await Inquiry.findById(id);

        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        // Agar file hai to Cloudinary se delete karein
        if (inquiry.attachmentUrl) {
            await deleteFromCloudinary(inquiry.attachmentUrl);
        }

        // Database se record delete karein
        await Inquiry.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true, 
            message: "Inquiry and associated file deleted successfully" 
        });

    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. Update Status (Resolved, Pending, etc.)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};