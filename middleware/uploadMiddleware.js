const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Setup (For Uploading)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video');
        return {
            folder: 'canva_solutions',
            resource_type: isVideo ? 'video' : 'auto', 
            allowed_formats: isVideo 
                ? ['mp4', 'webm', 'mov', 'mkv'] 
                : ['jpg', 'png', 'webp', 'jpeg'],
            transformation: isVideo ? [{ quality: "auto" }] : []
        };
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

const deleteFromCloudinary = async (fileUrl, resourceType = 'image') => {
    if (!fileUrl) return;

    try {
        
        const urlParts = fileUrl.split('/');
        const folderName = urlParts[urlParts.length - 2]; // canva_solutions
        const fileName = urlParts[urlParts.length - 1].split('.')[0]; // abc12345
        const publicId = `${folderName}/${fileName}`;

        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`✅ Deleted ${resourceType} from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error("❌ Cloudinary Delete Error:", error);
    }
};


module.exports = { upload, deleteFromCloudinary };