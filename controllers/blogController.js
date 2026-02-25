const Blog = require('../models/Blog');
const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.createBlog = async (req, res) => {
    try {
        const { 
            title, excerpt, category, author, readTime, date, intro, 
            slug, metaTitle, metaDescription, metaKeywords 
        } = req.body;

        let sections = req.body.sections ? JSON.parse(req.body.sections) : [];
        let mainImageUrl = "";

        if (req.files) {
            req.files.forEach(file => {
                if (file.fieldname === 'mainImage') mainImageUrl = file.path;
                if (file.fieldname.startsWith('sectionImage_')) {
                    const index = parseInt(file.fieldname.split('_')[1]);
                    if (sections[index]) sections[index].image = file.path;
                }
            });
        }

        const newBlog = new Blog({
            title, excerpt, category, author, readTime, date, intro,
            slug, metaTitle, metaDescription, metaKeywords,
            sections, 
            image: mainImageUrl
        });

        await newBlog.save(); 
        res.status(201).json({ success: true, data: newBlog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ message: "Blog post not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.json(blog);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBlog = async (req, res) => {
    try {
        const { 
            title, excerpt, category, author, readTime, date, intro,
            slug, metaTitle, metaDescription, metaKeywords 
        } = req.body;
        
        let sections = JSON.parse(req.body.sections);
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Not found" });

        if (req.files) {
            for (const file of req.files) {
                if (file.fieldname === 'mainImage') {
                    if (blog.image) {
                        await deleteFromCloudinary(blog.image, 'image');
                    }
                    blog.image = file.path;
                }
                if (file.fieldname.startsWith('sectionImage_')) {
                    const index = parseInt(file.fieldname.split('_')[1]);
                    if (sections[index]) {
                        if (blog.sections[index]?.image) {
                            await deleteFromCloudinary(blog.sections[index].image, 'image');
                        }
                        sections[index].image = file.path;
                    }
                }
            }
        }

        blog.title = title || blog.title;
        blog.excerpt = excerpt || blog.excerpt;
        blog.category = category || blog.category;
        blog.readTime = readTime || blog.readTime;
        blog.intro = intro || blog.intro;
        blog.date = date || blog.date;
        blog.author = author || blog.author;
        blog.slug = slug || blog.slug;
        blog.metaTitle = metaTitle || blog.metaTitle;
        blog.metaDescription = metaDescription || blog.metaDescription;
        blog.metaKeywords = metaKeywords || blog.metaKeywords;
        blog.sections = sections;

        await blog.save(); 
        res.status(200).json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.image) {
            await deleteFromCloudinary(blog.image, 'image');
        }

        if (blog.sections && blog.sections.length > 0) {
            for (const section of blog.sections) {
                if (section.image) {
                    await deleteFromCloudinary(section.image, 'image');
                }
            }
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};