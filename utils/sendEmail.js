const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
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
        // Timeout ko thora mazeed badhaein taake connection stable ho
        connectionTimeout: 15000, 
        greetingTimeout: 15000,
        socketTimeout: 15000
    });

    const mailOptions = {
        from: `"Canva Solutions" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // Yahan await lagana lazmi hai
    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;