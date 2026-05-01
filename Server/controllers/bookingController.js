const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Profile = require('../models/Profile');
const emailService = require('../utils/emailService');
const Pricing = require('../models/Pricing');
const RideOffers = require('../models/RideOffers');
const distanceService = require('../utils/distanceService');
const db = require('../config/db');

// ─── Book a slot ──────────────────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  const { driver_id, sub_slot_id, pickup_lat, pickup_lon, pickup_address, dropoff_lat, dropoff_lon, dropoff_address } = req.body;
  const passenger_id = req.user.id;

  if (!driver_id || !sub_slot_id) {
    return res.status(400).json({ message: "driver_id and sub_slot_id are required" });
  }

  try {
    // Check sub-slot is still available
    const subSlotRows = await Slot.getSubSlotById(sub_slot_id);
    if (subSlotRows.length === 0) return res.status(404).json({ message: "Sub-slot not found" });
    if (subSlotRows[0].is_booked) return res.status(409).json({ message: "This sub-slot is already booked" });

    // Calculate distance if coordinates provided
    let distance_km = 0;
    if (pickup_lat && pickup_lon && dropoff_lat && dropoff_lon) {
      try {
        const distanceData = await distanceService.getDistance(pickup_lat, pickup_lon, dropoff_lat, dropoff_lon);
        distance_km = parseFloat(distanceData.distance_km);
      } catch (e) {
        console.error("Distance calculation failed:", e.message);
      }
    }

    // Calculate fare
    const fareInfo = await Pricing.calculateFare(driver_id, distance_km);

    // Create booking
    const bookingData = {
      passenger_id,
      driver_id,
      sub_slot_id,
      pickup_address,
      dropoff_address,
      pickup_lat: pickup_lat || null,
      pickup_lon: pickup_lon || null,
      dropoff_lat: dropoff_lat || null,
      dropoff_lon: dropoff_lon || null,
      distance_km,
      base_fare: fareInfo.base_fare,
      per_km_charge: fareInfo.per_km_charge,
      discount_amount: fareInfo.discount_amount || 0,
      total_fare: fareInfo.total_fare
    };

    const result = await db.query(
      `INSERT INTO bookings
       (passenger_id, driver_id, sub_slot_id, pickup_address, dropoff_address,
        pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, distance_km,
        base_fare, per_km_charge, discount_amount, total_fare)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        passenger_id, driver_id, sub_slot_id, pickup_address, dropoff_address,
        pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, distance_km,
        fareInfo.base_fare, fareInfo.per_km_charge, fareInfo.discount_amount || 0, fareInfo.total_fare
      ]
    );

    // Mark sub-slot as booked
    await Slot.markSubSlotBooked(sub_slot_id, passenger_id);

    // Notify both parties via email (non-blocking)
    try {
      await emailService.sendBookingConfirmation(passenger_id, driver_id, sub_slot_id, result[0].insertId);
    } catch (e) {
      console.error("Booking email failed:", e.message);
    }

    res.status(201).json({
      message: "Booking confirmed!",
      bookingId: result[0].insertId,
      fareInfo
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get passenger's bookings ─────────────────────────────────────────────────
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.getBookingsByPassenger(req.user.id);
    res.json(bookings);
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get driver's incoming bookings ───────────────────────────────────────────
exports.getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.getBookingsByDriver(req.user.id);
    res.json(bookings);
  } catch (err) {
    console.error("getDriverBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Cancel booking ───────────────────────────────────────────────────────────
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const bookingRows = await Booking.getBookingById(bookingId);
    if (bookingRows.length === 0) return res.status(404).json({ message: "Booking not found" });

    const booking = bookingRows[0];
    if (booking.status === 'in_progress') {
      return res.status(400).json({ message: "Cannot cancel an ongoing ride" });
    }

    await Booking.cancelBooking(bookingId, req.user.id);
    // Free the slot again
    await Slot.markSlotAvailable(booking.slot_id);
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Driver: update booking status ───────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const allowed = ['confirmed', 'in_progress', 'completed'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const bookingRows = await Booking.getBookingById(bookingId);
    if (bookingRows.length === 0) return res.status(404).json({ message: "Booking not found" });
    if (bookingRows[0].driver_id != req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await Booking.updateBookingStatus(bookingId, status);

    // If completed, free slot for future reuse
    if (status === 'completed') {
      await Slot.markSubSlotAvailable(bookingRows[0].sub_slot_id);
    }

    res.json({ message: `Booking status updated to ${status}` });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Request Offers from Drivers ──────────────────────────────────────────

exports.requestOffers = async (req, res) => {
  const {
    driver_ids, // Array of driver IDs
    pickup_lat,
    pickup_lon,
    pickup_address,
    dropoff_lat,
    dropoff_lon,
    dropoff_address,
    estimated_km
  } = req.body;

  const passenger_id = req.user.id;

  if (!Array.isArray(driver_ids) || driver_ids.length === 0) {
    return res.status(400).json({ message: "driver_ids array is required" });
  }

  if (!pickup_address || !dropoff_address) {
    return res.status(400).json({ message: "pickup_address and dropoff_address are required" });
  }

  try {
    const expiresAt = new Date(Date.now() + 1800000); // 30 minutes expiration
    const createdOffers = [];

    for (const driver_id of driver_ids) {
      try {
        // For each driver, try to get their rates and create offer with estimated fare
        const rates = await Pricing.getDriverRates(driver_id);
        let estimated_fare = 0;

        if (rates) {
          const fareCalc = await Pricing.calculateFare(driver_id, estimated_km || 0);
          estimated_fare = fareCalc.total_fare;
        }

        const result = await RideOffers.createOffer({
          driver_id,
          passenger_id,
          pickup_lat: pickup_lat || null,
          pickup_lon: pickup_lon || null,
          pickup_address,
          dropoff_lat: dropoff_lat || null,
          dropoff_lon: dropoff_lon || null,
          dropoff_address,
          estimated_km: estimated_km || 0,
          offered_fare: estimated_fare,
          slot_sub_slot_id: null,
          expires_at: expiresAt
        });

        createdOffers.push(result.insertId);
      } catch (e) {
        console.error(`Failed to create offer for driver ${driver_id}:`, e.message);
        // Continue with other drivers
      }
    }

    res.status(201).json({
      message: `Offers sent to ${createdOffers.length} drivers`,
      offerIds: createdOffers,
      expiresAt
    });
  } catch (err) {
    console.error("requestOffers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Ride Offers for Passenger ────────────────────────────────────────

exports.getMyOffers = async (req, res) => {
  try {
    const offers = await RideOffers.getPassengerOffers(req.user.id);
    res.json(offers);
  } catch (err) {
    console.error("getMyOffers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Accept Offer and Create Booking ──────────────────────────────────────

exports.acceptOffer = async (req, res) => {
  const { offerId } = req.params;

  try {
    const offerRows = await RideOffers.getOfferById(offerId);
    if (offerRows.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const offer = offerRows[0];

    // Verify passenger
    if (offer.passenger_id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if offer is still valid
    if (offer.offer_status !== 'pending') {
      return res.status(400).json({ message: `Offer is already ${offer.offer_status}` });
    }

    // Create booking from the offer
    const [result] = await db.query(
      `INSERT INTO bookings
       (passenger_id, driver_id, offer_id, pickup_address, dropoff_address,
        pickup_lat, pickup_lon, dropoff_lat, dropoff_lon, distance_km,
        base_fare, per_km_charge, total_fare, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [
        req.user.id,
        offer.driver_id,
        offerId,
        offer.pickup_address,
        offer.dropoff_address,
        offer.pickup_lat,
        offer.pickup_lon,
        offer.dropoff_lat,
        offer.dropoff_lon,
        offer.estimated_km,
        0, // base_fare calculation would go here
        0, // per_km_charge
        offer.offered_fare
      ]
    );

    // Mark offer as accepted
    await RideOffers.updateOfferStatus(offerId, 'accepted');

    // Mark sub-slot as booked if provided
    if (offer.slot_sub_slot_id) {
      await Slot.markSubSlotBooked(offer.slot_sub_slot_id, req.user.id);
    }

    // Reject competing offers
    await RideOffers.rejectCompetingOffers(offerId, offer.driver_id, req.user.id);

    res.status(201).json({
      message: "Offer accepted and booking confirmed!",
      bookingId: result[0].insertId
    });
  } catch (err) {
    console.error("acceptOffer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get single booking ───────────────────────────────────────────────────────
exports.getBookingById = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const rows = await Booking.getBookingById(bookingId);
    if (rows.length === 0) return res.status(404).json({ message: "Booking not found" });

    const booking = rows[0];
    // Only allow involved parties
    if (booking.passenger_id != req.user.id && booking.driver_id != req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(booking);
  } catch (err) {
    console.error("getBookingById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
