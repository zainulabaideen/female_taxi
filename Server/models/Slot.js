const db = require("../config/db");

// ─── Driver Slots (Date-Based) ────────────────────────────────────────────────

exports.addSlot = async (driver_id, available_date, from_time, to_time, duration_minutes = 60) => {
  // Insert the main slot
  const [result] = await db.query(
    `INSERT INTO driver_slots (driver_id, available_date, from_time, to_time, duration_minutes, is_active)
     VALUES (?, ?, ?, ?, ?, TRUE)`,
    [driver_id, available_date, from_time, to_time, duration_minutes]
  );

  const slotId = result.insertId;

  // Auto-create sub-slots based on duration_minutes
  await exports.createSubSlots(slotId, from_time, to_time, duration_minutes);

  return result;
};

// ─── Create Sub-Slots ─────────────────────────────────────────────────────────

exports.createSubSlots = async (driver_slot_id, from_time, to_time, duration_minutes) => {
  // Parse time strings to minutes
  const [fromHour, fromMin] = from_time.split(':').map(Number);
  const [toHour, toMin] = to_time.split(':').map(Number);

  let startMinutes = fromHour * 60 + fromMin;
  const endMinutes = toHour * 60 + toMin;

  const subSlots = [];

  while (startMinutes < endMinutes) {
    const slotEndMinutes = Math.min(startMinutes + duration_minutes, endMinutes);

    const slotStartHour = Math.floor(startMinutes / 60);
    const slotStartMin = startMinutes % 60;
    const slotEndHour = Math.floor(slotEndMinutes / 60);
    const slotEndMin = slotEndMinutes % 60;

    const startTime = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}:00`;
    const endTime = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}:00`;

    subSlots.push([driver_slot_id, startTime, endTime]);
    startMinutes = slotEndMinutes;
  }

  // Batch insert sub-slots
  if (subSlots.length > 0) {
    await db.query(
      `INSERT INTO driver_slot_sub_slots (driver_slot_id, start_time, end_time) VALUES ?`,
      [subSlots]
    );
  }
};

// ─── Get Slots by Driver ──────────────────────────────────────────────────────

exports.getSlotsByDriver = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT * FROM driver_slots WHERE driver_id = ? AND is_active = TRUE ORDER BY available_date, from_time`,
    [driver_id]
  );
  return rows;
};

// ─── Get Slot with Sub-Slots ──────────────────────────────────────────────────

exports.getSlotWithSubSlots = async (slot_id) => {
  const [slotRows] = await db.query(
    `SELECT * FROM driver_slots WHERE id = ?`,
    [slot_id]
  );

  if (slotRows.length === 0) return null;

  const slot = slotRows[0];
  const [subSlots] = await db.query(
    `SELECT * FROM driver_slot_sub_slots WHERE driver_slot_id = ? ORDER BY start_time`,
    [slot_id]
  );

  return { ...slot, subSlots };
};

// ─── Get Available Sub-Slots for Driver ────────────────────────────────────────

exports.getAvailableSubSlotsByDriver = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT ss.*, ds.available_date, ds.driver_id
     FROM driver_slot_sub_slots ss
     JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE ds.driver_id = ? AND ss.is_booked = FALSE AND ds.is_active = TRUE
     ORDER BY ds.available_date, ss.start_time`,
    [driver_id]
  );
  return rows;
};

// ─── Get Available Sub-Slots for Specific Driver (Passenger View) ──────────────

exports.getAvailableSubSlotsByDriverId = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT ss.id, ss.driver_slot_id, ss.start_time, ss.end_time, ss.is_booked,
            ds.available_date, ds.from_time, ds.to_time
     FROM driver_slot_sub_slots ss
     JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE ds.driver_id = ? AND ss.is_booked = FALSE AND ds.is_active = TRUE AND ds.available_date >= CURDATE()
     ORDER BY ds.available_date, ss.start_time`,
    [driver_id]
  );
  return rows;
};

// ─── Mark Sub-Slot as Booked ──────────────────────────────────────────────────

exports.markSubSlotBooked = async (sub_slot_id, passenger_id) => {
  const [result] = await db.query(
    `UPDATE driver_slot_sub_slots SET is_booked = TRUE, booked_by_passenger_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [passenger_id, sub_slot_id]
  );
  return result;
};

// ─── Mark Sub-Slot as Available ───────────────────────────────────────────────

exports.markSubSlotAvailable = async (sub_slot_id) => {
  const [result] = await db.query(
    `UPDATE driver_slot_sub_slots SET is_booked = FALSE, booked_by_passenger_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [sub_slot_id]
  );
  return result;
};

// ─── Get Sub-Slot by ID ───────────────────────────────────────────────────────

exports.getSubSlotById = async (sub_slot_id) => {
  const [rows] = await db.query(
    `SELECT ss.*, ds.available_date, ds.driver_id, ds.from_time, ds.to_time
     FROM driver_slot_sub_slots ss
     JOIN driver_slots ds ON ds.id = ss.driver_slot_id
     WHERE ss.id = ?`,
    [sub_slot_id]
  );
  return rows;
};

// ─── Delete Slot (Only if No Sub-Slots are Booked) ────────────────────────────

exports.deleteSlot = async (slot_id, driver_id) => {
  // Check if any sub-slots are booked
  const [bookedSlots] = await db.query(
    `SELECT COUNT(*) as count FROM driver_slot_sub_slots WHERE driver_slot_id = ? AND is_booked = TRUE`,
    [slot_id]
  );

  if (bookedSlots[0].count > 0) {
    return { affectedRows: 0 }; // Cannot delete if sub-slots are booked
  }

  // Delete sub-slots first
  await db.query(
    `DELETE FROM driver_slot_sub_slots WHERE driver_slot_id = ?`,
    [slot_id]
  );

  // Delete the main slot
  const [result] = await db.query(
    `DELETE FROM driver_slots WHERE id = ? AND driver_id = ?`,
    [slot_id, driver_id]
  );

  return result;
};

// ─── Mark Slot as Inactive ────────────────────────────────────────────────────

exports.deactivateSlot = async (slot_id, driver_id) => {
  const [result] = await db.query(
    `UPDATE driver_slots SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND driver_id = ?`,
    [slot_id, driver_id]
  );
  return result;
};

// ─── Get Slot by ID ───────────────────────────────────────────────────────────

exports.getSlotById = async (slot_id) => {
  const [rows] = await db.query(`SELECT * FROM driver_slots WHERE id = ?`, [slot_id]);
  return rows;
};

// ─── Get Upcoming Slots for Driver ────────────────────────────────────────────

exports.getUpcomingSlots = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT * FROM driver_slots
     WHERE driver_id = ? AND available_date >= CURDATE() AND is_active = TRUE
     ORDER BY available_date, from_time`,
    [driver_id]
  );
  return rows;
};

// ─── Clean up Past Slots ──────────────────────────────────────────────────────

exports.cleanupPastSlots = async () => {
  const [result] = await db.query(
    `UPDATE driver_slots SET is_active = FALSE
     WHERE available_date < CURDATE()`
  );
  return result;
};
