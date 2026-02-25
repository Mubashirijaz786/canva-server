const ServicePage = require('../models/ServicePage');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

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
            if (updateData.contentItems && typeof updateData.contentItems === 'string') {
                updateData.contentItems = JSON.parse(updateData.contentItems);
            }
            if (updateData.faqs && typeof updateData.faqs === 'string') {
                updateData.faqs = JSON.parse(updateData.faqs);
            }
            if (updateData.checklist && typeof updateData.checklist === 'string') {
                updateData.checklist = JSON.parse(updateData.checklist);
            }
            if (updateData.reasons && typeof updateData.reasons === 'string') {
                updateData.reasons = JSON.parse(updateData.reasons);
            }
        } catch (parseErr) {
            return res.status(400).json({ message: "Invalid array format" });
        }

        if (req.file) {
            const existingPage = await ServicePage.findOne({ pageId });
            if (existingPage && existingPage.heroImage) {
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