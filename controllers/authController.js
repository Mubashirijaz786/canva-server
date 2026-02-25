const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Otp = require('../models/Otp');
const generateTokens = (user) => {
 
    const accessToken = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '1d' } 
    );
    const refreshToken = jwt.sign(
        { id: user._id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};





const cookieOptions = {
    httpOnly: true,
    secure: true, // Live environment (HTTPS) ke liye true hona lazmi hai
    sameSite: 'none', // Cross-site (Vercel to Railway) ke liye ye zaroori hai
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = [...user.refreshToken, refreshToken];
        await user.save();
        res.cookie('jwt', refreshToken, cookieOptions);
        res.json({ accessToken, role: user.role, email: user.email, name: user.name });
    } catch (err) { next(err); }
};

// --- YE NAYA FUNCTION HAI ---
exports.addAdmin = async (req, res, next) => {
    try {
        if (req.role !== 'superadmin') {
            return res.status(403).json({ message: "Only Super Admin can add new admins." });
        }
        const { email, password, name } = req.body;
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(400).json({ message: "Admin already exists." });

        const newUser = new User({ email, password, name, role: 'admin' });
        await newUser.save();
        res.status(201).json({ message: "New Admin created successfully!" });
    } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.jwt;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            const user = await User.findOne({ _id: decoded.id, refreshToken });
            if (!user) return res.status(403).json({ message: "Invalid Session" });
            const tokens = generateTokens(user);
            user.refreshToken = [...user.refreshToken.filter(rt => rt !== refreshToken), tokens.refreshToken];
            await user.save();
            res.cookie('jwt', tokens.refreshToken, cookieOptions);
            res.json({ accessToken: tokens.accessToken, role: user.role, name: user.name, email: user.email });
        });
    } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.jwt;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
                await user.save();
            }
        }
        res.clearCookie('jwt', cookieOptions);
        res.sendStatus(204);
    } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Email ko lowercase karke search karein
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            // Security reason: User ko na batayein ke email exist nahi karta
            return res.status(200).json({ message: "If an account exists, a reset link has been sent." });
        }

        // Reset Token generate karein
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Token ko hash karke DB mein save karein
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour validity
        
        await user.save();

        // Frontend URL jo email mein jayega
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - Canva Solutions',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #2563eb;">Password Reset</h2>
                        <p>Aapne password reset ki request ki hai. Niche diye gaye button par click karein:</p>
                        <div style="margin: 30px 0;">
                            <a href="${resetLink}" style="background:#2563eb; color:#fff; padding:12px 25px; text-decoration:none; border-radius:8px; font-weight: bold;">Reset My Password</a>
                        </div>
                        <p style="font-size: 12px; color: #666;">Ye link 1 ghante tak valid hai. Agar aapne ye request nahi ki, to is email ko ignore karein.</p>
                    </div>`
            });

            res.status(200).json({ message: "Reset link sent to your email!" });
        } catch (emailErr) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent. Try again later." });
        }

    } catch (err) { next(err); }
};
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.refreshToken = []; // Security: Logout from all devices

        await user.save();
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) { next(err); }
};
 // Ensure Otp model is imported


// --- STEP 1: Send OTP to New Admin ---
exports.sendAdminOTP = async (req, res, next) => {
    try {
        if (req.role !== 'superadmin') {
            return res.status(403).json({ message: "Only Super Admin can initiate this." });
        }

        const { email, name } = req.body;
        if (!email || !name) return res.status(400).json({ message: "Name and Email are required" });

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: "Admin with this email already exists!" });

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Save OTP to DB
        await Otp.deleteMany({ email });
        await Otp.create({ email, otp });

        // Send Email
        await sendEmail({
            email,
            subject: 'Admin Access Verification - Canva Solutions',
            html: `<h1>${otp}</h1><p>Super Admin is adding you as an admin. Share this code with them to complete your registration.</p>`
        });

        res.status(200).json({ message: "OTP sent to new admin's email!" });
    } catch (err) { next(err); }
};

// --- STEP 2: Final Verification & Creation ---
exports.verifyAndAddAdmin = async (req, res, next) => {
    try {
        if (req.role !== 'superadmin') return res.status(403).json({ message: "Forbidden" });

        const { email, password, name, otp } = req.body;

        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

        const newUser = new User({ 
            email: email.toLowerCase(), 
            password, 
            name, 
            role: 'admin' 
        }); 

        await newUser.save();
        await Otp.deleteMany({ email }); // Clear OTP
        
        res.status(201).json({ message: "New Admin registered successfully!" });
    } catch (err) { next(err); }
};
// controllers/authController.js ke niche add karein

// --- ADMINS LIST (For Superadmin) ---
exports.getAllAdmins = async (req, res, next) => {
    try {
        // Sirf admins aur superadmins nikalna, password aur refreshToken hide kar dena
        const admins = await User.find({ 
            role: { $in: ['admin', 'superadmin'] } 
        }).select('-password -refreshToken');
        
        res.status(200).json(admins);
    } catch (err) { next(err); }
};

// --- REMOVE ADMIN (For Superadmin) ---
exports.removeAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Security Check: Superadmin khud ko delete na kar sake
        if (id === req.user) {
            return res.status(400).json({ message: "Bhai, aap khud ko remove nahi kar sakte!" });
        }

        const adminToRemove = await User.findById(id);
        if (!adminToRemove) return res.status(404).json({ message: "Admin not found" });

        // Security Check: Superadmin kisi doosre Superadmin ko remove na kare (Optional)
        if (adminToRemove.role === 'superadmin') {
            return res.status(403).json({ message: "Cannot remove another Super Admin." });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Admin removed successfully!" });
    } catch (err) { next(err); }
};