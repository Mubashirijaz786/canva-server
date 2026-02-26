const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video');
        
        return {
            folder: 'canva_solutions',
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            transformation: isVideo ? [{ quality: "auto" }] : []
        };
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return;
    try {
        const parts = fileUrl.split('/');
        const fileWithExt = parts.pop();
        const folder = parts.pop();
        const publicId = `${folder}/${fileWithExt.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        
        console.log(`Deleted: ${publicId}`);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error.message);
    }
};

module.exports = { upload, deleteFromCloudinary };