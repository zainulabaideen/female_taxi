const db = require("../config/db");

// ─── Create all tables ────────────────────────────────────────────────────────
const initTables = async () => {
  // Users table (passengers + drivers)
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      full_name    VARCHAR(150) NOT NULL,
      email        VARCHAR(255) NOT NULL UNIQUE,
      phone        VARCHAR(30)  NOT NULL,
      password     VARCHAR(255) NOT NULL,
      role         ENUM('passenger','driver') NOT NULL,
      status       ENUM('pending','active','suspended') DEFAULT 'active',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Driver profiles
  await db.query(`
    CREATE TABLE IF NOT EXISTS driver_profiles (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      user_id        INT NOT NULL UNIQUE,
      car_model      VARCHAR(100),
      license_plate  VARCHAR(50),
      car_year       YEAR,
      location       VARCHAR(200),
      latitude       DECIMAL(10,8),
      longitude      DECIMAL(11,8),
      service_radius_km INT DEFAULT 20,
      cnic_front     VARCHAR(300),
      cnic_back      VARCHAR(300),
      approval_status ENUM('pending','approved','rejected') DEFAULT 'pending',
      rejection_note VARCHAR(500),
      rating_avg     DECIMAL(3,2) DEFAULT 0,
      total_rides    INT DEFAULT 0,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Passenger profiles (emergency contacts)
  await db.query(`
    CREATE TABLE IF NOT EXISTS passenger_profiles (
      id                 INT AUTO_INCREMENT PRIMARY KEY,
      user_id            INT NOT NULL UNIQUE,
      emergency_name     VARCHAR(150),
      emergency_phone    VARCHAR(30),
      emergency_email    VARCHAR(255),
      whatsapp           VARCHAR(30),
      guardian_email     VARCHAR(255),
      total_rides        INT DEFAULT 0,
      created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Driver availability slots (date-based, not recurring weekly)
  await db.query(`
    CREATE TABLE IF NOT EXISTS driver_slots (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      driver_id         INT NOT NULL,
      available_date    DATE NOT NULL,
      from_time         TIME NOT NULL,
      to_time           TIME NOT NULL,
      duration_minutes  INT DEFAULT 60,
      is_active         BOOLEAN DEFAULT TRUE,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_driver_date (driver_id, available_date)
    )
  `);

  // Driver slot sub-slots (1-hour or configurable blocks within a slot)
  await db.query(`
    CREATE TABLE IF NOT EXISTS driver_slot_sub_slots (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      driver_slot_id       INT NOT NULL,
      start_time           TIME NOT NULL,
      end_time             TIME NOT NULL,
      is_booked            BOOLEAN DEFAULT FALSE,
      booked_by_passenger_id INT,
      created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_slot_id) REFERENCES driver_slots(id) ON DELETE CASCADE,
      FOREIGN KEY (booked_by_passenger_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_driver_slot (driver_slot_id)
    )
  `);

  // Driver pricing rates
  await db.query(`
    CREATE TABLE IF NOT EXISTS driver_rates (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      driver_id         INT NOT NULL UNIQUE,
      per_km_charge     DECIMAL(5,2) DEFAULT 0,
      base_fare         DECIMAL(10,2) DEFAULT 0,
      surge_multiplier  DECIMAL(3,2) DEFAULT 1.0,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Driver discount rules
  await db.query(`
    CREATE TABLE IF NOT EXISTS driver_discounts (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      driver_id         INT NOT NULL,
      discount_type     ENUM('percentage', 'fixed', 'free') NOT NULL,
      discount_value    DECIMAL(10,2) NOT NULL,
      min_km            INT DEFAULT 0,
      max_km            INT DEFAULT 10000,
      is_active         BOOLEAN DEFAULT TRUE,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_driver (driver_id)
    )
  `);

  // Ride offers (bidding system)
  await db.query(`
    CREATE TABLE IF NOT EXISTS ride_offers (
      id                       INT AUTO_INCREMENT PRIMARY KEY,
      driver_id                INT NOT NULL,
      passenger_id             INT NOT NULL,
      pickup_lat               DECIMAL(10,8),
      pickup_lon               DECIMAL(11,8),
      pickup_address           VARCHAR(500),
      dropoff_lat              DECIMAL(10,8),
      dropoff_lon              DECIMAL(11,8),
      dropoff_address          VARCHAR(500),
      estimated_km             DECIMAL(8,2),
      offered_fare             DECIMAL(10,2),
      offer_status             ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
      slot_sub_slot_id         INT,
      expires_at               TIMESTAMP,
      created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (slot_sub_slot_id) REFERENCES driver_slot_sub_slots(id) ON DELETE SET NULL,
      INDEX idx_driver_status (driver_id, offer_status),
      INDEX idx_passenger_status (passenger_id, offer_status)
    )
  `);

  // Bookings
  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id                    INT AUTO_INCREMENT PRIMARY KEY,
      passenger_id          INT NOT NULL,
      driver_id             INT NOT NULL,
      slot_id               INT,
      sub_slot_id           INT,
      offer_id              INT,
      pickup_address        VARCHAR(300),
      dropoff_address       VARCHAR(300),
      pickup_lat            DECIMAL(10,8),
      pickup_lon            DECIMAL(11,8),
      dropoff_lat           DECIMAL(10,8),
      dropoff_lon           DECIMAL(11,8),
      distance_km           DECIMAL(8,2),
      base_fare             DECIMAL(10,2),
      per_km_charge         DECIMAL(5,2),
      discount_amount       DECIMAL(10,2) DEFAULT 0,
      total_fare            DECIMAL(10,2),
      status                ENUM('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
      driver_location_lat   DECIMAL(10,8),
      driver_location_lon   DECIMAL(11,8),
      is_completed_by_driver BOOLEAN DEFAULT FALSE,
      created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (driver_id)    REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (slot_id)      REFERENCES driver_slots(id) ON DELETE SET NULL,
      FOREIGN KEY (sub_slot_id)  REFERENCES driver_slot_sub_slots(id) ON DELETE SET NULL,
      FOREIGN KEY (offer_id)     REFERENCES ride_offers(id) ON DELETE SET NULL,
      INDEX idx_passenger_status (passenger_id, status),
      INDEX idx_driver_status (driver_id, status)
    )
  `);

  // Reports
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      reporter_id  INT NOT NULL,
      reported_id  INT,
      booking_id   INT,
      report_type  ENUM('safety','driver_behavior','passenger_behavior','emergency','other') NOT NULL,
      description  TEXT NOT NULL,
      status       ENUM('open','investigating','resolved','dismissed') DEFAULT 'open',
      admin_note   TEXT,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Super Admins (separate table)
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      email      VARCHAR(255) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      name       VARCHAR(150) DEFAULT 'Super Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // SOS / Emergency alerts
  await db.query(`
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      passenger_id INT NOT NULL,
      booking_id   INT,
      latitude     DECIMAL(10,8),
      longitude    DECIMAL(11,8),
      address      VARCHAR(500),
      status       ENUM('active','resolved') DEFAULT 'active',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ All tables initialized");
};

initTables().catch(console.error);

// ─── User CRUD ────────────────────────────────────────────────────────────────
exports.createUser = async (data) => {
  const [result] = await db.query(
    `INSERT INTO users (full_name, email, phone, password, role, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.full_name, data.email, data.phone, data.password, data.role, data.status || 'active']
  );
  return result;
};

exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows;
};

exports.getAllUsers = async (role = null) => {
  if (role) {
    const [rows] = await db.query("SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE role = ?", [role]);
    return rows;
  }
  const [rows] = await db.query("SELECT id, full_name, email, phone, role, status, created_at FROM users");
  return rows;
};

exports.updateUserStatus = async (id, status) => {
  const [result] = await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
  return result;
};

exports.deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result;
};
