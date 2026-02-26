const axios = require('axios');

const sendEmail = async (options) => {
    try {
        const data = {
            sender: { 
                name: "Canva Solutions", 
                email: process.env.SENDER_EMAIL || "mubashirejaz786@gmail.com" 
            },
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.html
        };

        
        if (options.attachments && options.attachments.length > 0) {
            data.attachment = options.attachments;
        }

        const config = {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.EMAIL_PASS,
                'content-type': 'application/json'
            }
        };

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, config);
        
        console.log("✅ BREVO API SUCCESS:", response.data.messageId);
        return response.data;

    } catch (error) {
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("❌ BREVO API ERROR:", errorDetail);
        throw new Error(errorDetail);
    }
};

module.exports = sendEmail;