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
            htmlContent: options.html // Brevo API mein 'htmlContent' likhte hain
        };

        const config = {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.EMAIL_PASS, // Aapki xsmtpsib-... wali key
                'content-type': 'application/json'
            }
        };

        // Seedha Brevo ki API ko hit kar rahe hain
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, config);
        
        console.log("✅ API EMAIL SENT SUCCESSFULLY:", response.data.messageId);
        return response.data;

    } catch (error) {
        // Agar koi galti ho to exact error message dikhayega
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("❌ BREVO API ERROR:", errorMessage);
        throw new Error(errorMessage);
    }
};

module.exports = sendEmail;