const Admin = require('../models/Admin');
const emailService = require('../utils/emailService');

// ─── File a report ────────────────────────────────────────────────────────────
exports.createReport = async (req, res) => {
  const { reported_id, booking_id, report_type, description } = req.body;
  const reporter_id = req.user.id;

  if (!report_type || !description) {
    return res.status(400).json({ message: "report_type and description are required" });
  }

  try {
    const result = await Admin.createReport({ reporter_id, reported_id, booking_id, report_type, description });
    res.status(201).json({ message: "Report submitted successfully", reportId: result.insertId });
  } catch (err) {
    console.error("createReport error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get user's own reports ───────────────────────────────────────────────────
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Admin.getReportsByUser(req.user.id);
    res.json(reports);
  } catch (err) {
    console.error("getMyReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── SOS Emergency (only during active booking) ───────────────────────────────
exports.triggerSOS = async (req, res) => {
  const { booking_id, latitude, longitude, address } = req.body;
  const passenger_id = req.user.id;

  try {
    const result = await Admin.createSOS({ passenger_id, booking_id, latitude, longitude, address });

    // Send emergency email to guardian & admin
    try {
      await emailService.sendSOSAlert({ passenger_id, booking_id, latitude, longitude, address });
    } catch (e) {
      console.error("SOS email failed:", e.message);
    }

    res.status(201).json({ message: "SOS alert triggered! Help is on the way.", sosId: result.insertId });
  } catch (err) {
    console.error("triggerSOS error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get passenger's SOS history ─────────────────────────────────────────────
exports.getMySOS = async (req, res) => {
  try {
    const alerts = await Admin.getSOS(req.user.id);
    res.json(alerts);
  } catch (err) {
    console.error("getMySOS error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
