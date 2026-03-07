const User = require('./models/User');

const seedSuperAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'superadmin' });
        
        if (existingAdmin) {
            console.log("⚠️ Super Admin already exists. Seeding skipped.");
            return;
        }

        const superAdmin = new User({
            name: "Mubashir SuperAdmin",
            email: "mb@gmail.com",
            password: "aaa", 
            role: "superadmin"
        });

        await superAdmin.save();
        
        console.log("-----------------------------------------");
        console.log("✅ SUCCESS: Super Admin created successfully!");
        console.log("📧 Email: mubashirejaz786@gmail.com");
        console.log("🔑 Password: asd");
        console.log("-----------------------------------------");

    } catch (err) {
        console.error("❌ ERROR while seeding:", err.message);
    }
};

module.exports = seedSuperAdmin;