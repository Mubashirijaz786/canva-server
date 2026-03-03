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
            use_filename: true, 
            unique_filename: true,
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
    if (!fileUrl || !fileUrl.includes('cloudinary')) return;
    
    try {
        
        
        const parts = fileUrl.split('/');
        const fileNameWithExt = parts.pop(); 
        const folderName = parts.pop(); 
        
        
        const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`;

        console.log(`Attempting to delete: ${publicId}`);

        
        
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        
        
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    } catch (error) {
        console.error("Cloudinary Deletion Failed:", error.message);
    }
};

module.exports = { upload, deleteFromCloudinary };