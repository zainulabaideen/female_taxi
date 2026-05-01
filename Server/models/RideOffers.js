const db = require("../config/db");

// ─── Create Ride Offer ────────────────────────────────────────────────────────

exports.createOffer = async (data) => {
  const {
    driver_id,
    passenger_id,
    pickup_lat,
    pickup_lon,
    pickup_address,
    dropoff_lat,
    dropoff_lon,
    dropoff_address,
    estimated_km,
    offered_fare,
    slot_sub_slot_id,
    expires_at
  } = data;

  const [result] = await db.query(
    `INSERT INTO ride_offers
     (driver_id, passenger_id, pickup_lat, pickup_lon, pickup_address,
      dropoff_lat, dropoff_lon, dropoff_address, estimated_km, offered_fare,
      slot_sub_slot_id, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      driver_id,
      passenger_id,
      pickup_lat,
      pickup_lon,
      pickup_address,
      dropoff_lat,
      dropoff_lon,
      dropoff_address,
      estimated_km,
      offered_fare,
      slot_sub_slot_id,
      expires_at
    ]
  );
  return result;
};

// ─── Get Incoming Offers for Driver ───────────────────────────────────────────

exports.getIncomingOffers = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT o.*,
            u.full_name AS passenger_name,
            u.email AS passenger_email,
            u.phone AS passenger_phone,
            dp.rating_avg AS passenger_rating
     FROM ride_offers o
     JOIN users u ON u.id = o.passenger_id
     LEFT JOIN passenger_profiles dp ON dp.user_id = u.id
     WHERE o.driver_id = ? AND o.offer_status = 'pending' AND o.expires_at > NOW()
     ORDER BY o.created_at DESC`,
    [driver_id]
  );
  return rows;
};

// ─── Get Active Offers from Driver ────────────────────────────────────────────

exports.getActiveOffers = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT o.*,
            u.full_name AS passenger_name,
            u.email AS passenger_email
     FROM ride_offers o
     JOIN users u ON u.id = o.passenger_id
     WHERE o.driver_id = ? AND o.offer_status IN ('pending', 'accepted') AND o.expires_at > NOW()
     ORDER BY o.created_at DESC`,
    [driver_id]
  );
  return rows;
};

// ─── Get Offers for Passenger ─────────────────────────────────────────────────

exports.getPassengerOffers = async (passenger_id) => {
  const [rows] = await db.query(
    `SELECT o.*,
            u.full_name AS driver_name,
            dp.car_model,
            dp.license_plate,
            dp.rating_avg AS driver_rating
     FROM ride_offers o
     JOIN users u ON u.id = o.driver_id
     LEFT JOIN driver_profiles dp ON dp.user_id = u.id
     WHERE o.passenger_id = ? AND o.offer_status = 'pending' AND o.expires_at > NOW()
     ORDER BY o.offered_fare ASC, o.created_at DESC`,
    [passenger_id]
  );
  return rows;
};

// ─── Update Offer Status ──────────────────────────────────────────────────────

exports.updateOfferStatus = async (offer_id, status) => {
  const [result] = await db.query(
    `UPDATE ride_offers SET offer_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, offer_id]
  );
  return result;
};

// ─── Get Offer by ID ──────────────────────────────────────────────────────────

exports.getOfferById = async (offer_id) => {
  const [rows] = await db.query(
    `SELECT o.*,
            d.full_name AS driver_name,
            dp.car_model,
            dp.license_plate,
            p.full_name AS passenger_name
     FROM ride_offers o
     JOIN users d ON d.id = o.driver_id
     LEFT JOIN driver_profiles dp ON dp.user_id = d.id
     JOIN users p ON p.id = o.passenger_id
     WHERE o.id = ?`,
    [offer_id]
  );
  return rows;
};

// ─── Reject Other Offers for Same Passenger-Route ──────────────────────────────

exports.rejectCompetingOffers = async (accepted_offer_id, driver_id, passenger_id) => {
  const [result] = await db.query(
    `UPDATE ride_offers
     SET offer_status = 'rejected', updated_at = CURRENT_TIMESTAMP
     WHERE driver_id != ? AND passenger_id = ? AND offer_status = 'pending' AND id != ?`,
    [driver_id, passenger_id, accepted_offer_id]
  );
  return result;
};

// ─── Cleanup Expired Offers ───────────────────────────────────────────────────

exports.expireOldOffers = async () => {
  const [result] = await db.query(
    `UPDATE ride_offers SET offer_status = 'expired'
     WHERE offer_status = 'pending' AND expires_at < NOW()`
  );
  return result;
};
