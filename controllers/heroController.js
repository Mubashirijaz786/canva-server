const Hero = require('../models/Hero');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getHero = async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) hero = await Hero.create({}); 
        res.status(200).json(hero);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};

exports.updateHero = async (req, res) => {
    try {
        const oldHero = await Hero.findOne();
        const updateData = { ...req.body };

        
        if (req.files && req.files.video) {
            
            if (oldHero?.videoUrl) {
                await deleteFromCloudinary(oldHero.videoUrl, 'video');
            }
            updateData.videoUrl = req.files.video[0].path; 
        } else if (req.body.videoDeleted === 'true') {
            
            if (oldHero?.videoUrl) {
                await deleteFromCloudinary(oldHero.videoUrl, 'video');
            }
            updateData.videoUrl = "";
        }

        
        let finalImages = [];
        if (req.body.existingImages) {
            const keptImages = JSON.parse(req.body.existingImages);
            finalImages = [...keptImages];

            if (oldHero?.clientImages) {
                for (const oldImg of oldHero.clientImages) {
                    if (!keptImages.includes(oldImg)) {
                        await deleteFromCloudinary(oldImg, 'image');
                    }
                }
            }
        } else if (oldHero?.clientImages) {
            for (const oldImg of oldHero.clientImages) {
                await deleteFromCloudinary(oldImg, 'image');
            }
        }

        if (req.files && req.files.clientImages) {
            const newImagePaths = req.files.clientImages.map(file => file.path);
            finalImages = [...finalImages, ...newImagePaths];
        }

        updateData.clientImages = finalImages;

        const updatedHero = await Hero.findOneAndUpdate(
            {}, 
            { $set: updateData }, 
            { new: true, upsert: true }
        );

        res.status(200).json(updatedHero);
    } catch (err) {
        console.error("Hero Update Error:", err);
        res.status(400).json({ message: err.message });
    }
};