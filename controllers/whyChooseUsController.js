const WhyChooseUs = require('../models/WhyChooseUs');
const WhyChooseUsImage = require('../models/WhyChooseUsImage');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getWhyChooseUsData = async (req, res) => {
    try {
        const cards = await WhyChooseUs.find().sort({ createdAt: 1 });
        const imageData = await WhyChooseUsImage.findOne();
        
        res.status(200).json({
            cards,
            mainImage: imageData ? imageData.featureImage : ""
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGlobalImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image file provided" });

        let imageData = await WhyChooseUsImage.findOne();

        if (imageData) {
            if (imageData.featureImage) {
                await deleteFromCloudinary(imageData.featureImage, 'image');
            }
            imageData.featureImage = req.file.path;
            await imageData.save();
        } else {
            imageData = new WhyChooseUsImage({
                featureImage: req.file.path
            });
            await imageData.save();
        }

        res.status(200).json({ success: true, data: imageData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addCard = async (req, res) => {
    try {
        const count = await WhyChooseUs.countDocuments();
        if (count >= 4) {
            return res.status(400).json({ 
                success: false, 
                message: "Limit reached! You can only add up to 4 cards." 
            });
        }
        const newCard = new WhyChooseUs(req.body);
        await newCard.save();
        res.status(201).json(newCard);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteCard = async (req, res) => {
    try {
        await WhyChooseUs.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Card deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};