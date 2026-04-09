const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get token from header (Format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next(); 
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};



module.exports = { verifyToken };