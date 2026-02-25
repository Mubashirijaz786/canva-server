const SEO = require('../models/SEO');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getSEOByPage = async (req, res) => {
    try {
        const seo = await SEO.findOne({ pageName: req.params.pageName });
        res.status(200).json(seo || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSEO = async (req, res) => {
    try {
        const { pageName, metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription } = req.body;
        let seo = await SEO.findOne({ pageName });

        const updateData = {
            metaTitle,
            metaDescription,
            metaKeywords,
            ogTitle,
            ogDescription
        };

        if (req.file) {
            if (seo?.ogImage) {
                await deleteFromCloudinary(seo.ogImage, 'image');
            }
            updateData.ogImage = req.file.path;
        }

        seo = await SEO.findOneAndUpdate(
            { pageName },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json(seo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};