const TrustedBy = require('../models/TrustedBy');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getTrustedData = async (req, res) => {
    try {
        let data = await TrustedBy.findOne();
        if (!data) {
            data = await TrustedBy.create({
                topText: "More than 100+ companies trust us worldwide",
                badgeText: "More About Our Company",
                heading: "All-in-One Service Provider",
                logos: [],
                sideImage: ""
            });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTrustedData = async (req, res) => {
    try {
        const oldData = await TrustedBy.findOne();
        const { topText, badgeText, heading } = req.body;
        
        // 1. Frontend se bache hue purane logos ki list parse karein
        let finalLogosList = req.body.existingLogos ? JSON.parse(req.body.existingLogos) : [];

        // 2. Jo logos list mein nahi hain unhein Cloudinary se delete karein (Cleanup)
        if (oldData && oldData.logos) {
            const removedLogos = oldData.logos.filter(url => !finalLogosList.includes(url));
            for (const url of removedLogos) {
                await deleteFromCloudinary(url, 'image');
            }
        }

        // 3. Naye upload kiye gaye logos ko array mein shamil karein
        if (req.files && req.files.logos) {
            const newLogoPaths = req.files.logos.map(file => file.path);
            finalLogosList = [...finalLogosList, ...newLogoPaths];
        }

        const updateData = {
            topText,
            badgeText,
            heading,
            logos: finalLogosList
        };

        // 4. Side Image handle karein
        if (req.files && req.files.sideImage) {
            if (oldData?.sideImage) {
                await deleteFromCloudinary(oldData.sideImage, 'image');
            }
            updateData.sideImage = req.files.sideImage[0].path;
        }

        const updated = await TrustedBy.findOneAndUpdate(
            {}, 
            { $set: updateData }, 
            { new: true, upsert: true }
        );

        res.status(200).json(updated);
    } catch (err) {
        console.error("❌ TrustedBy Update Error:", err);
        res.status(500).json({ message: err.message });
    }
};