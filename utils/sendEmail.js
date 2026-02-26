const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587, 
        secure: false, 
        auth: { 
            // Railway variables se uthayega
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        },
        tls: {
            rejectUnauthorized: false 
        }
    });

    const mailOptions = {
        // 'from' hamesha verified email honi chahiye (aapki gmail)
        from: `"Canva Solutions" <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;