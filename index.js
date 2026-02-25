require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Database Connect
connectDB();

const app = express();

// --- 1. MIDDLEWARES ---
app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({ 
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 
app.use(cookieParser());

// --- 2. ROUTES REGISTRATION ---
// Humne inhein yahan import kiya hai taake dotenv.config() pehle execute ho chuka ho
const settingsRoutes = require('./routes/settingsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const servicePageRoutes = require('./routes/servicePageRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const statsRoutes = require('./routes/statsRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const faqRoutes = require('./routes/faqRoutes');
const whyChooseUsRoutes = require('./routes/whyChooseUsRoutes');
const heroRoutes = require('./routes/heroRoutes');
const trustedByRoutes = require('./routes/trustedByRoutes');
const seoRoutes = require('./routes/seoRoutes');
const portfolioConfigRoutes = require('./routes/portfolioConfigRoutes');
const serviceRoutes = require('./routes/serviceRoutes'); // ✅ Path check kar lena file ka



app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/service-pages', servicePageRoutes);
app.use('/api/about-page', aboutRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/whychooseus', whyChooseUsRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/trusted-by', trustedByRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/portfolio-config', portfolioConfigRoutes);
app.use('/api/services', serviceRoutes); // ✅ Ab aapka endpoint /api/services ban gaya
// Health Check
app.get('/', (req, res) => res.send("🚀 Canva Solutions Server is Running!"));
app.get('/api/test-email', async (req, res) => {
    try {
        const sendEmail = require('./utils/sendEmail');
        await sendEmail({
            email: 'mubashirejaz786@gmail.com',
            subject: 'Test Email',
            html: '<h1>Server is working!</h1>'
        });
        res.send("Email Sent Successfully! ✅");
    } catch (err) {
        res.status(500).send("Email Failed: " + err.message);
    }
});
// --- 3. 404 HANDLER ---
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// --- 4. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {

    console.error("❌ SERVER ERROR =>", err.message); 
    res.status(err.status || 500).json({ 
        success: false,
        message: err.message || "Internal Server Error" 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
   
    if(!process.env.CLOUDINARY_API_KEY) {
        console.log("⚠️ WARNING: Cloudinary API Key missing in process.env!");
    }
});