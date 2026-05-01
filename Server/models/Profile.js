const db = require("../config/db");

// ─── Driver Profile ──────────────────────────────────────────────────────────
exports.createDriverProfile = async (data) => {
  const [result] = await db.query(
    `INSERT INTO driver_profiles (user_id, car_model, license_plate, car_year, location, cnic_front, cnic_back)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id, data.car_model, data.license_plate, data.car_year, data.location, data.cnic_front, data.cnic_back]
  );
  return result;
};

exports.getDriverProfile = async (user_id) => {
  const [rows] = await db.query(
    `SELECT dp.*, u.full_name, u.email, u.phone, u.status 
     FROM driver_profiles dp
     JOIN users u ON u.id = dp.user_id
     WHERE dp.user_id = ?`,
    [user_id]
  );
  return rows;
};

exports.updateDriverProfile = async (user_id, data) => {
  const [result] = await db.query(
    `UPDATE driver_profiles 
     SET car_model=?, license_plate=?, car_year=?, location=?
     WHERE user_id=?`,
    [data.car_model, data.license_plate, data.car_year, data.location, user_id]
  );
  return result;
};

exports.getApprovedDrivers = async () => {
  const [rows] = await db.query(
    `SELECT dp.*, u.full_name, u.email, u.phone, u.status
     FROM driver_profiles dp
     JOIN users u ON u.id = dp.user_id
     WHERE dp.approval_status = 'approved' AND u.status = 'active'`
  );
  return rows;
};

exports.getPendingDrivers = async () => {
  const [rows] = await db.query(
    `SELECT dp.*, u.full_name, u.email, u.phone, u.created_at as registered_at
     FROM driver_profiles dp
     JOIN users u ON u.id = dp.user_id
     WHERE dp.approval_status = 'pending'`
  );
  return rows;
};

exports.updateApprovalStatus = async (driver_id, status, note = null) => {
  const [result] = await db.query(
    `UPDATE driver_profiles SET approval_status=?, rejection_note=? WHERE user_id=?`,
    [status, note, driver_id]
  );
  return result;
};

// ─── Passenger Profile ───────────────────────────────────────────────────────
exports.createPassengerProfile = async (data) => {
  const [result] = await db.query(
    `INSERT INTO passenger_profiles (user_id, emergency_name, emergency_phone, emergency_email, whatsapp, guardian_email)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.user_id, data.emergency_name, data.emergency_phone, data.emergency_email, data.whatsapp, data.guardian_email]
  );
  return result;
};

exports.getPassengerProfile = async (user_id) => {
  const [rows] = await db.query(
    `SELECT pp.*, u.full_name, u.email, u.phone
     FROM passenger_profiles pp
     JOIN users u ON u.id = pp.user_id
     WHERE pp.user_id = ?`,
    [user_id]
  );
  return rows;
};

exports.updatePassengerProfile = async (user_id, data) => {
  const [result] = await db.query(
    `UPDATE passenger_profiles 
     SET emergency_name=?, emergency_phone=?, emergency_email=?, whatsapp=?, guardian_email=?
     WHERE user_id=?`,
    [data.emergency_name, data.emergency_phone, data.emergency_email, data.whatsapp, data.guardian_email, user_id]
  );
  return result;
};
