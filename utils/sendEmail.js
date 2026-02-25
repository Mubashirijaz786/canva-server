const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // ✅ Port 465 connection timeout ko khatam karti hai
        secure: true, // Port 465 ke liye true hona lazmi hai
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        },
        // ✅ Connection timeout settings badha dein
        connectionTimeout: 10000, 
        greetingTimeout: 10000,
        socketTimeout: 10000
    });

    const mailOptions = {
        from: `"Canva Solutions" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments || [] 
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;