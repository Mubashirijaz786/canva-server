const ServicePage = require('../models/ServicePage');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const FAQ = require('../models/FAQ');
const Team = require('../models/Team');
const Review = require('../models/Review');
const AboutPage = require('../models/AboutPage');
const WhyChooseUs = require('../models/WhyChooseUs');

exports.downloadFullSitemap = async (req, res) => {
    try {
        // ✅ Env file se dynamic URL
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; 

        // 🚀 Parallel Fetching (Sari tables aik saath scan hongi)
        const [services, blogs, projects, faqs, members, reviews, about, features] = await Promise.all([
            ServicePage.find({}, 'slug updatedAt heroImage'),
            Blog.find({}, 'slug updatedAt image'),
            Project.find({}, 'slug updatedAt image'),
            FAQ.find({}, 'updatedAt'),
            Team.find({}, 'updatedAt image'),
            Review.find({}, 'updatedAt'),
            AboutPage.find({}, 'updatedAt'),
            WhyChooseUs.find({}, 'updatedAt')
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

        // --- 1. CORE PAGES (Static Routes) ---
        const coreRoutes = ['', '/services', '/portfolio', '/blog', '/about', '/contact', '/faqs'];
        coreRoutes.forEach(route => {
            xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // --- 2. DYNAMIC SERVICES (With Images) ---
        services.forEach(s => {
            xml += `
  <url>
    <loc>${baseUrl}/services/${s.slug}</loc>
    <lastmod>${s.updatedAt.toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>${s.heroImage ? `
    <image:image>
      <image:loc>${s.heroImage}</image:loc>
    </image:image>` : ''}
  </url>`;
        });

        // --- 3. DYNAMIC BLOGS (With Images) ---
        blogs.forEach(b => {
            xml += `
  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${b.updatedAt.toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>${b.image ? `
    <image:image>
      <image:loc>${b.image}</image:loc>
    </image:image>` : ''}
  </url>`;
        });

        // --- 4. DYNAMIC PROJECTS (With Images) ---
        projects.forEach(p => {
            xml += `
  <url>
    <loc>${baseUrl}/portfolio/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>${p.image ? `
    <image:image>
      <image:loc>${p.image}</image:loc>
    </image:image>` : ''}
  </url>`;
        });

        // --- 5. OTHER DATA UPDATES (Signal to Google) ---
        // Ye pages direct URL nahi rakhte magar unka data pages par show hota hai
        // Hum unki latest update date sitemap mein shamil kar rahe hain
        const extraData = [...faqs, ...members, ...reviews, ...about, ...features];
        if (extraData.length > 0) {
            const latestUpdate = new Date(Math.max(...extraData.map(e => e.updatedAt)));
            xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${latestUpdate.toISOString().split('T')[0]}</lastmod>
    <changefreq>always</changefreq>
  </url>`;
        }

        xml += `\n</urlset>`;

        // ✅ Direct Download Headers
        res.header('Content-Type', 'application/xml');
        res.attachment('canvasolutions-full-sitemap.xml');
        return res.send(xml);

    } catch (err) {
        res.status(500).json({ message: "Master Sitemap Error", error: err.message });
    }
};