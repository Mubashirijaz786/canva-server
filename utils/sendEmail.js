const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Railway par Port 2525 sab se ziada stable hai
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 2525, 
        secure: false, 
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        },
        tls: {
            rejectUnauthorized: false 
        },
        // Connection ko foran kill ya connect karne ke liye
        connectionTimeout: 10000, 
        greetingTimeout: 10000,
        socketTimeout: 10000
    });

    const mailOptions = {
        from: `"Canva Solutions" <${process.env.SENDER_EMAIL || "mubashirejaz786@gmail.com"}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ EMAIL SENT SUCCESSFULLY:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ NODEMAILER ERROR INSIDE UTILS:", error.message);
        throw error; // Is se controller ke catch block mein chala jayega
    }
};

module.exports = sendEmail;