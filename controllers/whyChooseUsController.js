const WhyChooseUs = require('../models/WhyChooseUs');

exports.getFeatures = async (req, res) => {
    try {
        const features = await WhyChooseUs.find().sort({ createdAt: 1 });
        res.status(200).json(features);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addFeature = async (req, res) => {
    try {
        const { title, description, iconName, isFeatured } = req.body;
        if (isFeatured === 'true' || isFeatured === true) await WhyChooseUs.updateMany({}, { isFeatured: false });
        
        const newFeature = new WhyChooseUs({
            title, description, iconName,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            image: req.file ? req.file.path : ""
        });
        await newFeature.save();
        res.status(201).json(newFeature);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateFeature = async (req, res) => {
    try {
        const { isFeatured } = req.body;
        if (isFeatured === 'true' || isFeatured === true) {
            const oldHero = await WhyChooseUs.findOne({ isFeatured: true });
            await WhyChooseUs.updateMany({}, { isFeatured: false });
            // Inherit image if no new file is uploaded
            if (!req.file && oldHero) req.body.image = oldHero.image;
        }
        
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;
        
        const updated = await WhyChooseUs.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updated);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteFeature = async (req, res) => {
    try {
        await WhyChooseUs.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Feature deleted successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};