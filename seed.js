const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure karein path sahi hai
const dotenv = require('dotenv');

// Env variables load karein
dotenv.config();

const seedSuperAdmin = async () => {
    try {
        // Database connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚀 MongoDB Connected... Creating Super Admin.");

        // Check karein agar koi superadmin pehle se majood hai
        const existingAdmin = await User.findOne({ role: 'superadmin' });
        
        if (existingAdmin) {
            console.log("⚠️ Super Admin already exists in database. No need to seed.");
            process.exit();
        }

       // const hashedPassword = await bcrypt.hash("asd", 12); // ❌ Isay comment kar dein

const superAdmin = new User({
    name: "Mubashir SuperAdmin",
    email: "mubashirejaz786@gmail.com",
    password: "asd", // ✅ Direct password likhein, model khud hash karega
    role: "superadmin"
}) ;

        await superAdmin.save();
        
        console.log("-----------------------------------------");
        console.log("✅ SUCCESS: Super Admin created successfully!");
        console.log("📧 Email: mubashirejaz786@gmail.com");
        console.log("🔑 Password: asd");
        console.log("-----------------------------------------");

        process.exit();
    } catch (err) {
        console.error("❌ ERROR while seeding:", err.message);
        process.exit(1);
    }
};

seedSuperAdmin();