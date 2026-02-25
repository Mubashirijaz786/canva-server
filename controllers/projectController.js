const Project = require('../models/Project');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) { next(err); }
};

exports.addProject = async (req, res, next) => {
    try {
        const { title, category, desc, link, tags, imageUrl } = req.body;
        const finalImage = req.file ? req.file.path : imageUrl;

        if (!finalImage) {
            return res.status(400).json({ message: "Project cover image is required" });
        }

        const newProject = new Project({ 
            title, 
            category, 
            desc, 
            link, 
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            image: finalImage 
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { title, category, desc, link, tags, imageUrl } = req.body;
        const project = await Project.findById(req.params.id);
        
        if (!project) return res.status(404).json({ message: "Project not found" });

        let finalImage = project.image; 

        if (req.file) {
            if (project.image) {
                await deleteFromCloudinary(project.image, 'image');
            }
            finalImage = req.file.path;
        } else if (imageUrl) {
            finalImage = imageUrl;
        }

        const updatedData = { 
            title, 
            category, 
            desc, 
            link, 
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            image: finalImage 
        };

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedProject);
    } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.image) {
            await deleteFromCloudinary(project.image, 'image');
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) { next(err); }
};