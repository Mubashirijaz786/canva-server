const Team = require('../models/Team');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware'); // ✅ Import delete helper

exports.getTeam = async (req, res, next) => {
    try {
        const members = await Team.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (err) { next(err); }
};

exports.addMember = async (req, res, next) => {
    try {
        const { name, role, linkedin, twitter, imageUrl } = req.body;
        const finalImage = req.file ? req.file.path : imageUrl;

        if (!finalImage) {
            return res.status(400).json({ message: "Image is required" });
        }

        const newMember = new Team({ name, role, linkedin, twitter, image: finalImage });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (err) { next(err); }
};

exports.updateMember = async (req, res, next) => {
    try {
        const { name, role, linkedin, twitter, imageUrl } = req.body;
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        let finalImage = member.image; 

        // ✅ Agar nayi file upload hui hai, toh purani Cloudinary se delete karein
        if (req.file) {
            if (member.image) {
                await deleteFromCloudinary(member.image, 'image');
            }
            finalImage = req.file.path;
        } else if (imageUrl) {
            finalImage = imageUrl;
        }

        const updatedData = { name, role, linkedin, twitter, image: finalImage };
        const updatedMember = await Team.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        
        res.json(updatedMember);
    } catch (err) { next(err); }
};

exports.deleteMember = async (req, res, next) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        // ✅ Member delete karne se pehle uski image Cloudinary se saaf karein
        if (member.image) {
            await deleteFromCloudinary(member.image, 'image');
        }

        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: "Member and image removed successfully" });
    } catch (err) { next(err); }
};