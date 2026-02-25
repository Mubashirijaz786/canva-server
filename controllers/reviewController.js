const Review = require('../models/Review');
const ReviewImage = require('../models/ReviewImage');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

// ✅ 1. BRANDING IMAGE UPDATE (ALAG MODEL)
exports.updateBrandingImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image upload karna lazmi hai" });

        let settings = await ReviewImage.findOne();
        
        if (settings && settings.brandingImage) {
            await deleteFromCloudinary(settings.brandingImage, 'image');
        }

        if (!settings) settings = new ReviewImage();
        
        settings.brandingImage = req.file.path;
        await settings.save();

        res.status(200).json({ success: true, brandingImage: settings.brandingImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ 2. GET ALL DATA (REVIEWS + BRANDING IMAGE)
exports.getReviewsData = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        const settings = await ReviewImage.findOne();
        res.status(200).json({
            reviews,
            brandingImage: settings?.brandingImage || ""
        });
    } catch (err) {
        res.status(500).json({ message: "Data fetch karne mein masla aaya." });
    }
};

// ✅ 3. ADD REVIEW (NO IMAGE LOGIC)
exports.addReview = async (req, res) => {
    try {
        const { author, role, quote, rating, isFeatured } = req.body;
        
        if (isFeatured === 'true' || isFeatured === true) {
            await Review.updateMany({}, { isFeatured: false });
        }
        
        const newReview = new Review({
            author, role, quote, 
            rating: Number(rating) || 5,
            isFeatured: isFeatured === 'true' || isFeatured === true
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ✅ 4. UPDATE REVIEW (NO IMAGE LOGIC)
exports.updateReview = async (req, res) => {
    try {
        const { isFeatured, author, role, quote, rating } = req.body;
        const review = await Review.findById(req.params.id);
        
        if (!review) return res.status(404).json({ message: "Review nahi mila." });

        if (isFeatured === 'true' || isFeatured === true) {
            await Review.updateMany({}, { isFeatured: false });
        }

        const updateData = {
            author: author || review.author,
            role: role || review.role,
            quote: quote || review.quote,
            rating: rating !== undefined ? Number(rating) : review.rating,
            isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : review.isFeatured
        };

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json(updatedReview);
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};

// ✅ 5. DELETE REVIEW (SIMPLE DELETE)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review nahi mila." });
        res.status(200).json({ message: "Review delete ho gaya." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};