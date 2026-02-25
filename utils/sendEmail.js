const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    const mailOptions = {
        from: `"Canva Solutions" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        // ✅ Agar attachments hain to list bhej do, warna empty array
        attachments: options.attachments || [] 
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;