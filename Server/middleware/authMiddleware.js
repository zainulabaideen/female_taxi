const jwt = require('jsonwebtoken');

// ─── Verify user JWT ──────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access denied: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ─── Verify admin JWT ─────────────────────────────────────────────────────────
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Admin access denied: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: "Not an admin account" });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired admin token" });
  }
};

// ─── Role guard ───────────────────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: `Access restricted to: ${roles.join(', ')}` });
  }
  next();
};

// ─── Driver must be approved ──────────────────────────────────────────────────
const requireApprovedDriver = async (req, res, next) => {
  if (req.user.role !== 'driver') return next();
  if (req.user.status === 'pending') {
    return res.status(403).json({ message: "Your driver account is pending admin approval" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, requireRole, requireApprovedDriver };