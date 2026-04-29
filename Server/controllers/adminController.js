const Admin = require('../models/Admin');
const User = require('../models/Users');
const Profile = require('../models/Profile');
const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const stats = await Admin.getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error("getDashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── All Users ────────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;
  try {
    const users = await User.getAllUsers(role || null);
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Suspend / Reactivate user ────────────────────────────────────────────────
exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // 'active' | 'suspended'
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    await User.updateUserStatus(userId, status);
    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    console.error("updateUserStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Delete user ──────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.deleteUser(userId);
    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Pending Driver Approvals ─────────────────────────────────────────────────
exports.getPendingDrivers = async (req, res) => {
  try {
    const drivers = await Profile.getPendingDrivers();
    res.json(drivers);
  } catch (err) {
    console.error("getPendingDrivers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Approve / Reject Driver ──────────────────────────────────────────────────
exports.reviewDriver = async (req, res) => {
  const { driverId } = req.params;
  const { action, note } = req.body; // action: 'approve' | 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: "action must be 'approve' or 'reject'" });
  }

  try {
    const approvalStatus = action === 'approve' ? 'approved' : 'rejected';
    const userStatus = action === 'approve' ? 'active' : 'suspended';

    await Profile.updateApprovalStatus(driverId, approvalStatus, note || null);
    await User.updateUserStatus(driverId, userStatus);

    // Notify driver via email
    try {
      const users = await User.findById(driverId);
      if (users.length > 0) {
        await emailService.sendDriverApprovalEmail(users[0].email, users[0].full_name, action, note);
      }
    } catch (e) {
      console.error("Driver approval email failed:", e.message);
    }

    res.json({ message: `Driver ${action}d successfully` });
  } catch (err) {
    console.error("reviewDriver error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── All Bookings ─────────────────────────────────────────────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── All Reports ──────────────────────────────────────────────────────────────
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Admin.getAllReports();
    res.json(reports);
  } catch (err) {
    console.error("getAllReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Update Report Status ─────────────────────────────────────────────────────
exports.updateReportStatus = async (req, res) => {
  const { reportId } = req.params;
  const { status, admin_note } = req.body;
  const allowed = ['open', 'investigating', 'resolved', 'dismissed'];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    await Admin.updateReportStatus(reportId, status, admin_note);
    res.json({ message: "Report updated" });
  } catch (err) {
    console.error("updateReportStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── All SOS Alerts ───────────────────────────────────────────────────────────
exports.getAllSOS = async (req, res) => {
  try {
    const alerts = await Admin.getAllSOS();
    res.json(alerts);
  } catch (err) {
    console.error("getAllSOS error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Resolve SOS ──────────────────────────────────────────────────────────────
exports.resolveSOS = async (req, res) => {
  const { sosId } = req.params;
  try {
    await Admin.resolveSOS(sosId);
    res.json({ message: "SOS alert resolved" });
  } catch (err) {
    console.error("resolveSOS error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
