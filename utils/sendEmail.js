const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        // ✅ Railway par 587 block ho sakti hai, is liye 2525 use kar rahe hain
        port: 2525, 
        secure: false, 
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        },
        // ✅ Live server par connection timeout se bachne ke liye ye settings lazmi hain
        tls: {
            rejectUnauthorized: false // SSL certificate validation bypass
        },
        connectionTimeout: 10000, // 10 seconds wait karega
    });

    const mailOptions = {
        // ✅ Ensure karein ke process.env.EMAIL_USER wahi email hai jo Brevo par verified hai
        from: `"Canva Solutions" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;