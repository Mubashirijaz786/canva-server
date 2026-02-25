const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

 jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
        console.log("JWT Verify Error:", err.name); 
        return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }

    // ✅ Payload extraction ko robust banayein
    const userPayload = decoded.userInfo || decoded;
    
    req.user = userPayload.id || userPayload._id;
    req.role = userPayload.role; 

    
    next();
});
};

module.exports = verifyJWT;