const Service = require('../models/Service');

// ✅ Get All Services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ✅ Update/Sync All Services (Bulk Update)
exports.updateServices = async (req, res) => {
    try {
        const servicesData = JSON.parse(req.body.services);
        
        // Purana data saaf karke naya insert karna (Bulk Sync)
        await Service.deleteMany({});
        const updatedServices = await Service.insertMany(servicesData);
        
        res.status(200).json({ success: true, data: updatedServices });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};