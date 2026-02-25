const PortfolioConfig = require('../models/PortfolioConfig');

exports.getPortfolioConfig = async (req, res) => {
    try {
        let config = await PortfolioConfig.findOne();
        if (!config) config = await PortfolioConfig.create({}); 
        res.status(200).json(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePortfolioConfig = async (req, res) => {
    try {
        const updated = await PortfolioConfig.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};