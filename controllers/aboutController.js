const AboutPage = require('../models/AboutPage');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.updateAboutData = async (req, res) => {
    try {
        let about = await AboutPage.findOne();
        if (!about) about = new AboutPage();

        // Arrays ko parse karein
        const stats = req.body.stats ? JSON.parse(req.body.stats) : about.stats;
        const founderSections = req.body.founderSections ? JSON.parse(req.body.founderSections) : about.founderSections;
        const valuesList = req.body.valuesList ? JSON.parse(req.body.valuesList) : about.valuesList;

        const oldHeroImage = about.heroImage;
        const oldFounderImage = about.founderImage;

        // ✅ Purely assigning the body content (Meta data is now non-existent)
        Object.assign(about, req.body);

        // Files handling logic (Wahi purani)
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (file.fieldname === 'heroImage') {
                    if (oldHeroImage) {
                        await deleteFromCloudinary(oldHeroImage, 'image');
                    }
                    about.heroImage = file.path;
                }

                if (file.fieldname === 'founderImage') {
                    if (oldFounderImage) {
                        await deleteFromCloudinary(oldFounderImage, 'image');
                    }
                    about.founderImage = file.path;
                }
            }
        }

        about.stats = stats;
        about.founderSections = founderSections;
        about.valuesList = valuesList;

        await about.save();
        res.status(200).json({ success: true, data: about });

    } catch (err) {
        console.error("❌ ABOUT UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAboutData = async (req, res) => {
    try {
        const about = await AboutPage.findOne();
        res.json(about || {});
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message }); 
    }
};