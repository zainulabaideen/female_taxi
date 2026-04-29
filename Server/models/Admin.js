const db = require("../config/db");

// ─── Reports ──────────────────────────────────────────────────────────────────
exports.createReport = async (data) => {
  const [result] = await db.query(
    `INSERT INTO reports (reporter_id, reported_id, booking_id, report_type, description)
     VALUES (?, ?, ?, ?, ?)`,
    [data.reporter_id, data.reported_id || null, data.booking_id || null, data.report_type, data.description]
  );
  return result;
};

exports.getReportsByUser = async (reporter_id) => {
  const [rows] = await db.query(
    `SELECT r.*, u.full_name AS reported_name
     FROM reports r
     LEFT JOIN users u ON u.id = r.reported_id
     WHERE r.reporter_id = ?
     ORDER BY r.created_at DESC`,
    [reporter_id]
  );
  return rows;
};

exports.getAllReports = async () => {
  const [rows] = await db.query(
    `SELECT r.*, 
       rep.full_name AS reporter_name,
       u.full_name AS reported_name
     FROM reports r
     JOIN users rep ON rep.id = r.reporter_id
     LEFT JOIN users u ON u.id = r.reported_id
     ORDER BY r.created_at DESC`
  );
  return rows;
};

exports.updateReportStatus = async (id, status, admin_note = null) => {
  const [result] = await db.query(
    `UPDATE reports SET status = ?, admin_note = ? WHERE id = ?`,
    [status, admin_note, id]
  );
  return result;
};

// ─── SOS Alerts ───────────────────────────────────────────────────────────────
exports.createSOS = async (data) => {
  const [result] = await db.query(
    `INSERT INTO sos_alerts (passenger_id, booking_id, latitude, longitude, address)
     VALUES (?, ?, ?, ?, ?)`,
    [data.passenger_id, data.booking_id || null, data.latitude || null, data.longitude || null, data.address || null]
  );
  return result;
};

exports.getSOS = async (passenger_id) => {
  const [rows] = await db.query(
    `SELECT * FROM sos_alerts WHERE passenger_id = ? ORDER BY created_at DESC`,
    [passenger_id]
  );
  return rows;
};

exports.getAllSOS = async () => {
  const [rows] = await db.query(
    `SELECT s.*, u.full_name AS passenger_name, u.email, u.phone
     FROM sos_alerts s
     JOIN users u ON u.id = s.passenger_id
     ORDER BY s.created_at DESC`
  );
  return rows;
};

exports.resolveSOS = async (id) => {
  const [result] = await db.query(
    `UPDATE sos_alerts SET status = 'resolved' WHERE id = ?`,
    [id]
  );
  return result;
};

// ─── Admin CRUD ───────────────────────────────────────────────────────────────
exports.findAdminByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
  return rows;
};

exports.createAdmin = async (email, hashedPassword, name = "Super Admin") => {
  const [result] = await db.query(
    "INSERT INTO admins (email, password, name) VALUES (?, ?, ?)",
    [email, hashedPassword, name]
  );
  return result;
};

exports.getAdminById = async (id) => {
  const [rows] = await db.query("SELECT id, email, name FROM admins WHERE id = ?", [id]);
  return rows;
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
exports.getDashboardStats = async () => {
  const [[totalUsers]] = await db.query("SELECT COUNT(*) AS count FROM users");
  const [[totalDrivers]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role='driver'");
  const [[totalPassengers]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role='passenger'");
  const [[pendingDrivers]] = await db.query("SELECT COUNT(*) AS count FROM driver_profiles WHERE approval_status='pending'");
  const [[totalBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings");
  const [[activeBookings]] = await db.query("SELECT COUNT(*) AS count FROM bookings WHERE status='in_progress'");
  const [[openReports]] = await db.query("SELECT COUNT(*) AS count FROM reports WHERE status='open'");
  const [[activeSOS]] = await db.query("SELECT COUNT(*) AS count FROM sos_alerts WHERE status='active'");

  return {
    totalUsers: totalUsers.count,
    totalDrivers: totalDrivers.count,
    totalPassengers: totalPassengers.count,
    pendingDrivers: pendingDrivers.count,
    totalBookings: totalBookings.count,
    activeBookings: activeBookings.count,
    openReports: openReports.count,
    activeSOS: activeSOS.count,
  };
};
