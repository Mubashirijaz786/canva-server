const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({}); // Pehli dafa default create kar do
        res.json(settings);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSettings = async (req, res) => {
    try {
        const updated = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ message: err.message }); }
};