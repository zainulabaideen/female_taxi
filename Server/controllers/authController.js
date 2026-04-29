const User = require('../models/Users');
const Profile = require('../models/Profile');
const { createAdmin, findAdminByEmail } = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { upload } = require('../middleware/multer');
const emailService = require('../utils/emailService');

// ─── Passenger Signup ─────────────────────────────────────────────────────────
exports.registerPassenger = async (req, res) => {
  const { full_name, email, phone, password, emergency_name, emergency_phone, emergency_email, whatsapp, guardian_email } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const userResult = await User.createUser({ full_name, email, phone, password: hashed, role: 'passenger', status: 'active' });
    const userId = userResult.insertId;

    await Profile.createPassengerProfile({
      user_id: userId,
      emergency_name, emergency_phone, emergency_email, whatsapp, guardian_email
    });

    res.status(201).json({ message: "Passenger account created successfully!" });
  } catch (err) {
    console.error("registerPassenger error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── Driver Signup (goes to pending → admin reviews) ─────────────────────────
exports.registerDriver = async (req, res) => {
  const { full_name, email, phone, password, car_model, license_plate, car_year, location } = req.body;

  if (!full_name || !email || !phone || !password || !car_model || !license_plate) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  // Check CNIC uploads
  const cnic_front = req.files?.cnic_front?.[0]?.filename;
  const cnic_back  = req.files?.cnic_back?.[0]?.filename;

  if (!cnic_front || !cnic_back) {
    return res.status(400).json({ message: "CNIC front and back images are required" });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    // Driver starts with 'pending' status (needs admin approval)
    const userResult = await User.createUser({ full_name, email, phone, password: hashed, role: 'driver', status: 'pending' });
    const userId = userResult.insertId;

    await Profile.createDriverProfile({
      user_id: userId, car_model, license_plate, car_year, location,
      cnic_front, cnic_back
    });

    // Notify admin via email
    try {
      await emailService.sendDriverRegistrationToAdmin({ full_name, email, phone, car_model, license_plate });
    } catch (e) {
      console.error("Email send failed:", e.message);
    }

    res.status(201).json({ message: "Driver application submitted! You will be notified after admin review." });
  } catch (err) {
    console.error("registerDriver error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ─── Login (Passenger & Driver) ───────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const users = await User.findByEmail(email);
    if (users.length === 0) return res.status(404).json({ message: "No account found with this email" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Driver must be approved
    if (user.role === 'driver' && user.status === 'pending') {
      return res.status(403).json({ message: "Your driver account is pending admin approval." });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Admin Login (separate) ───────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const admins = await findAdminByEmail(email);
    if (admins.length === 0) return res.status(404).json({ message: "Admin not found" });

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: 'admin', email: admin.email },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      admintoken: token,
      admin: { id: admin.id, email: admin.email, name: admin.name }
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Create first Super Admin (one-time setup) ────────────────────────────────
exports.createSuperAdmin = async (req, res) => {
  const { email, password, name, setupKey } = req.body;

  // Protect with a setup key from .env
  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(403).json({ message: "Invalid setup key" });
  }

  try {
    const existing = await findAdminByEmail(email);
    if (existing.length > 0) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 12);
    await createAdmin(email, hashed, name || "Super Admin");
    res.status(201).json({ message: "Super admin created successfully" });
  } catch (err) {
    console.error("createSuperAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get current user profile ─────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const users = await User.findById(req.user.id);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const user = users[0];
    let profile = null;

    if (user.role === 'driver') {
      const dp = await Profile.getDriverProfile(req.user.id);
      profile = dp[0] || null;
    } else {
      const pp = await Profile.getPassengerProfile(req.user.id);
      profile = pp[0] || null;
    }

    res.json({ user, profile });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};