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

// ─── Share Location With Guardian ────────────────────────────────────────────
exports.shareLocationWithGuardian = async (req, res) => {
  const { latitude, longitude, address, booking_id } = req.body;
  const passenger_id = req.user.id;

  try {
    const db = require('../config/db');
    // Get passenger profile for guardian contact
    const [profileRows] = await db.query(
      `SELECT pp.*, u.full_name, u.phone 
       FROM passenger_profiles pp 
       JOIN users u ON u.id = pp.user_id 
       WHERE pp.user_id = ?`,
      [passenger_id]
    );

    const profile = profileRows[0];
    const guardianEmail = profile?.guardian_email || profile?.emergency_email;
    const passengerName = profile?.full_name;
    const mapsLink = latitude && longitude
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : null;

    if (guardianEmail) {
      const html = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#402763,#5a3585);padding:28px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:900;color:#ffcd60;">SHEGO</p>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">📍 Live Location Update</p>
          </div>
          <div style="padding:28px 30px;background:#fff;color:#333;line-height:1.7;">
            <p><strong>${passengerName}</strong> is sharing their live location with you from their SHEGO ride.</p>
            ${address ? `<p><strong>Current Location:</strong> ${address}</p>` : ''}
            ${mapsLink ? `<div style="text-align:center;margin:20px 0;"><a href="${mapsLink}" style="background:#402763;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">📍 View on Google Maps</a></div>` : ''}
            <p style="font-size:13px;color:#777;">This location update was sent automatically from the SHEGO safety app. If you are concerned, please contact the passenger directly.</p>
          </div>
          <div style="background:#f7f9fb;border-top:1px solid #e8e8e8;text-align:center;padding:16px 20px;">
            <p style="margin:0;font-size:12px;color:#999;">SHEGO — Safe Female Rides | Pakistan</p>
          </div>
        </div>
      `;
      await emailService.sendEmail?.({ to: guardianEmail, subject: `📍 ${passengerName}'s Live Location — SHEGO`, html })
        .catch(e => console.error("Guardian email failed:", e.message));
    }

    res.json({ message: "Location shared with guardian", hasGuardian: !!guardianEmail });
  } catch (err) {
    console.error("shareLocationWithGuardian error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
