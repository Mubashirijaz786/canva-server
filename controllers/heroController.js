const Hero = require('../models/Hero');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getHero = async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            hero = await Hero.create({
                badgeText: "NEXT-GEN IT SOLUTION 2026",
                heading: "Transforming Ideas into Online Success",
                description: "At Canva Solutions, our expert digital services are powered by cutting-edge tools.",
                statsText: "We’re Canva Solutions — the AI-fueled digital agency.",
                happyClientsCount: "100+",
                clientImages: [] 
            });
        }
        res.status(200).json(hero);
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};

exports.updateHero = async (req, res) => {
    try {
        const { badgeText, heading, description, happyClientsCount, statsText } = req.body;
        
        
        const oldHero = await Hero.findOne();
        
        const updateData = {
            badgeText, heading, description, happyClientsCount, statsText
        };

       
        if (req.files && req.files.video) {
          
            if (oldHero?.videoUrl) {
                await deleteFromCloudinary(oldHero.videoUrl, 'video');
            }
            updateData.videoUrl = req.files.video[0].path; 
        }

  
        if (req.files && req.files.clientImages) {
           
            if (oldHero?.clientImages?.length > 0) {
                for (const imgUrl of oldHero.clientImages) {
                    await deleteFromCloudinary(imgUrl, 'image');
                }
            }
            updateData.clientImages = req.files.clientImages.map(file => file.path);
        }

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