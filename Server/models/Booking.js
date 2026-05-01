const db = require("../config/db");

// ─── Bookings ─────────────────────────────────────────────────────────────────
exports.createBooking = async (data) => {
  const [result] = await db.query(
    `INSERT INTO bookings (passenger_id, driver_id, sub_slot_id, pickup_address, dropoff_address,
     pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, distance_km, base_fare, per_km_charge,
     discount_amount, total_fare)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.passenger_id, data.driver_id, data.sub_slot_id, data.pickup_address, data.dropoff_address,
      data.pickup_lat, data.pickup_lon, data.dropoff_lat, data.dropoff_lon, data.distance_km,
      data.base_fare, data.per_km_charge, data.discount_amount, data.total_fare
    ]
  );
  return result;
};

exports.getBookingById = async (id) => {
  const [rows] = await db.query(
    `SELECT b.*,
       p.full_name AS passenger_name, p.email AS passenger_email, p.phone AS passenger_phone,
       d.full_name AS driver_name, d.email AS driver_email, d.phone AS driver_phone,
       ss.start_time, ss.end_time,
       ds.available_date
     FROM bookings b
     JOIN users p ON p.id = b.passenger_id
     JOIN users d ON d.id = b.driver_id
     LEFT JOIN driver_slot_sub_slots ss ON ss.id = b.sub_slot_id
     LEFT JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE b.id = ?`,
    [id]
  );
  return rows;
};

exports.getBookingsByPassenger = async (passenger_id) => {
  const [rows] = await db.query(
    `SELECT b.*,
       d.full_name AS driver_name,
       dp.car_model, dp.license_plate, dp.location,
       ss.start_time, ss.end_time,
       ds.available_date
     FROM bookings b
     JOIN users d ON d.id = b.driver_id
     JOIN driver_profiles dp ON dp.user_id = d.id
     LEFT JOIN driver_slot_sub_slots ss ON ss.id = b.sub_slot_id
     LEFT JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE b.passenger_id = ?
     ORDER BY b.created_at DESC`,
    [passenger_id]
  );
  return rows;
};

exports.getBookingsByDriver = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT b.*,
       p.full_name AS passenger_name, p.email AS passenger_email, p.phone AS passenger_phone,
       ss.start_time, ss.end_time,
       ds.available_date
     FROM bookings b
     JOIN users p ON p.id = b.passenger_id
     LEFT JOIN driver_slot_sub_slots ss ON ss.id = b.sub_slot_id
     LEFT JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE b.driver_id = ?
     ORDER BY b.created_at DESC`,
    [driver_id]
  );
  return rows;
};

exports.getAllBookings = async () => {
  const [rows] = await db.query(
    `SELECT b.*,
       p.full_name AS passenger_name,
       d.full_name AS driver_name,
       ss.start_time, ss.end_time,
       ds.available_date
     FROM bookings b
     JOIN users p ON p.id = b.passenger_id
     JOIN users d ON d.id = b.driver_id
     LEFT JOIN driver_slot_sub_slots ss ON ss.id = b.sub_slot_id
     LEFT JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     ORDER BY b.created_at DESC`
  );
  return rows;
};

exports.updateBookingStatus = async (id, status) => {
  const [result] = await db.query("UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id]);
  return result;
};

exports.cancelBooking = async (id, passenger_id) => {
  const [result] = await db.query(
    "UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND passenger_id = ?",
    [id, passenger_id]
  );
  return result;
};
