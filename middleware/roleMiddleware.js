// middleware/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // req.role humne verifyJWT mein set kiya hua hai
        if (!req.role || !allowedRoles.includes(req.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Access Denied: Role (${req.role}) doesn't have permission.` 
            });
        }
        next();
    };
};

module.exports = authorizeRoles;