const ServicePage = require('../models/ServicePage');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getAllSlugs = async (req, res) => {
    try {
        const pages = await ServicePage.find({}, 'pageId slug');
        res.status(200).json(pages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPageBySlug = async (req, res) => {
    try {
        const data = await ServicePage.findOne({ slug: req.params.slug });
        if (!data) return res.status(404).json({ message: "Service page not found" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPageData = async (req, res) => {
    try {
        const data = await ServicePage.findOne({ pageId: req.params.pageId });
        if (!data) return res.status(200).json({}); 
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePageData = async (req, res) => {
    try {
        const { pageId } = req.params;
        let updateData = { ...req.body };

        try {
            const arraysToParse = ['contentItems', 'faqs', 'checklist', 'reasons'];
            arraysToParse.forEach(key => {
                if (updateData[key] && typeof updateData[key] === 'string') {
                    updateData[key] = JSON.parse(updateData[key]);
                }
            });
        } catch (parseErr) {
            return res.status(400).json({ message: "Invalid data format in arrays" });
        }

        if (req.file) {
            const existingPage = await ServicePage.findOne({ pageId });
            if (existingPage?.heroImage) {
                await deleteFromCloudinary(existingPage.heroImage, 'image');
            }
            updateData.heroImage = req.file.path; 
        }

        const updatedPage = await ServicePage.findOneAndUpdate(
            { pageId },
            { $set: updateData },
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true,
                runValidators: true 
            }
        );

        res.status(200).json(updatedPage);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};