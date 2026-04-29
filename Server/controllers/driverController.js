const Profile = require('../models/Profile');
const Slot = require('../models/Slot');
const User = require('../models/Users');
const Pricing = require('../models/Pricing');
const RideOffers = require('../models/RideOffers');
const Booking = require('../models/Booking');
const distanceService = require('../utils/distanceService');
const db = require('../config/db');

// ─── Get current driver's profile ────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.getDriverProfile(req.user.id);
    if (profile.length === 0) return res.status(404).json({ message: "Driver profile not found" });
    res.json(profile[0]);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Update driver profile ────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  const { car_model, license_plate, car_year, location } = req.body;
  try {
    await Profile.updateDriverProfile(req.user.id, { car_model, license_plate, car_year, location });
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get driver's slots ───────────────────────────────────────────────────────
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.getSlotsByDriver(req.user.id);
    res.json(slots);
  } catch (err) {
    console.error("getSlots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Add a slot ───────────────────────────────────────────────────────────────
exports.addSlot = async (req, res) => {
  const { day_of_week, from_time, to_time } = req.body;
  if (!day_of_week || !from_time || !to_time) {
    return res.status(400).json({ message: "day_of_week, from_time and to_time are required" });
  }
  try {
    const result = await Slot.addSlot(req.user.id, day_of_week, from_time, to_time);
    res.status(201).json({ message: "Slot added", slotId: result.insertId });
  } catch (err) {
    console.error("addSlot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Delete a slot ────────────────────────────────────────────────────────────
exports.deleteSlot = async (req, res) => {
  const { slotId } = req.params;
  try {
    const result = await Slot.deleteSlot(slotId, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Slot not found, already booked, or unauthorized" });
    }
    res.json({ message: "Slot removed" });
  } catch (err) {
    console.error("deleteSlot error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get all approved drivers (for passengers) ────────────────────────────────
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Profile.getApprovedDrivers();
    // For each driver, fetch their available sub-slots
    const driversWithSlots = await Promise.all(
      drivers.map(async (driver) => {
        const availableSubSlots = await Slot.getAvailableSubSlotsByDriverId(driver.user_id);
        return { ...driver, availableSubSlots };
      })
    );
    res.json(driversWithSlots);
  } catch (err) {
    console.error("getAllDrivers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get slots for a specific driver (passengers view) ────────────────────────
exports.getDriverSlots = async (req, res) => {
  const { driverId } = req.params;
  try {
    // Only return available (not booked) slots for security
    const slots = await Slot.getAvailableSubSlotsByDriverId(driverId);
    res.json(slots);
  } catch (err) {
    console.error("getDriverSlots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Add Availability (Date-Based with Auto Sub-Slots) ──────────────────────

exports.addAvailability = async (req, res) => {
  const { available_date, from_time, to_time, duration_minutes } = req.body;

  if (!available_date || !from_time || !to_time) {
    return res.status(400).json({ message: "available_date, from_time, and to_time are required" });
  }

  try {
    const result = await Slot.addSlot(
      req.user.id,
      available_date,
      from_time,
      to_time,
      duration_minutes || 60
    );

    const slotData = await Slot.getSlotWithSubSlots(result.insertId);
    res.status(201).json({
      message: `Availability added with ${slotData.subSlots.length} sub-slots`,
      slotId: result.insertId,
      subSlotCount: slotData.subSlots.length
    });
  } catch (err) {
    console.error("addAvailability error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Driver's Availability ───────────────────────────────────────────────

exports.getAvailability = async (req, res) => {
  try {
    const slots = await Slot.getUpcomingSlots(req.user.id);

    // Fetch sub-slots for each slot
    const slotsWithSubSlots = await Promise.all(
      slots.map(async (slot) => {
        const slotDetail = await Slot.getSlotWithSubSlots(slot.id);
        return slotDetail;
      })
    );

    res.json(slotsWithSubSlots);
  } catch (err) {
    console.error("getAvailability error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Delete Availability ─────────────────────────────────────────────────────

exports.deleteAvailability = async (req, res) => {
  const { slotId } = req.params;
  try {
    const result = await Slot.deleteSlot(slotId, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Slot not found, has booked sub-slots, or unauthorized" });
    }
    res.json({ message: "Availability removed" });
  } catch (err) {
    console.error("deleteAvailability error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Driver Rates ────────────────────────────────────────────────────────

exports.getRates = async (req, res) => {
  try {
    const rates = await Pricing.getDriverRates(req.user.id);
    if (!rates) {
      return res.json({
        per_km_charge: 0,
        base_fare: 0,
        surge_multiplier: 1.0
      });
    }
    res.json(rates);
  } catch (err) {
    console.error("getRates error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Set Driver Rates ────────────────────────────────────────────────────────

exports.setRates = async (req, res) => {
  const { per_km_charge, base_fare, surge_multiplier } = req.body;

  if (per_km_charge === undefined || base_fare === undefined) {
    return res.status(400).json({ message: "per_km_charge and base_fare are required" });
  }

  try {
    await Pricing.setDriverRates(req.user.id, {
      per_km_charge,
      base_fare,
      surge_multiplier: surge_multiplier || 1.0
    });

    res.json({ message: "Rates updated successfully" });
  } catch (err) {
    console.error("setRates error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Driver Discounts ────────────────────────────────────────────────────

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Pricing.getDriverDiscounts(req.user.id);
    res.json(discounts);
  } catch (err) {
    console.error("getDiscounts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Add Discount ────────────────────────────────────────────────────────────

exports.addDiscount = async (req, res) => {
  const { discount_type, discount_value, min_km, max_km } = req.body;

  if (!discount_type || !discount_value) {
    return res.status(400).json({ message: "discount_type and discount_value are required" });
  }

  try {
    const result = await Pricing.addDiscount(req.user.id, {
      discount_type,
      discount_value,
      min_km: min_km || 0,
      max_km: max_km || 10000
    });

    res.status(201).json({
      message: "Discount added",
      discountId: result.insertId
    });
  } catch (err) {
    console.error("addDiscount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Remove Discount ─────────────────────────────────────────────────────────

exports.removeDiscount = async (req, res) => {
  const { discountId } = req.params;
  try {
    const result = await Pricing.removeDiscount(discountId, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Discount not found or unauthorized" });
    }
    res.json({ message: "Discount removed" });
  } catch (err) {
    console.error("removeDiscount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Incoming Offers ─────────────────────────────────────────────────────

exports.getIncomingOffers = async (req, res) => {
  try {
    const offers = await RideOffers.getIncomingOffers(req.user.id);
    res.json(offers);
  } catch (err) {
    console.error("getIncomingOffers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Respond to Offer (Accept/Reject) ────────────────────────────────────────

exports.respondToOffer = async (req, res) => {
  const { offerId } = req.params;
  const { response, offered_fare } = req.body; // response: "accept" or "reject"

  if (!response || !['accept', 'reject'].includes(response)) {
    return res.status(400).json({ message: "response must be 'accept' or 'reject'" });
  }

  try {
    const offerRows = await RideOffers.getOfferById(offerId);
    if (offerRows.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const offer = offerRows[0];
    if (offer.driver_id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (response === 'accept') {
      // Accept the offer
      await RideOffers.updateOfferStatus(offerId, 'accepted');

      // Mark sub-slot as booked
      if (offer.slot_sub_slot_id) {
        await Slot.markSubSlotBooked(offer.slot_sub_slot_id, offer.passenger_id);
      }

      // Reject other offers for this passenger
      await RideOffers.rejectCompetingOffers(offerId, req.user.id, offer.passenger_id);

      res.json({ message: "Offer accepted and booking created" });
    } else {
      // Reject the offer
      await RideOffers.updateOfferStatus(offerId, 'rejected');
      res.json({ message: "Offer rejected" });
    }
  } catch (err) {
    console.error("respondToOffer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Active Offers ───────────────────────────────────────────────────────

exports.getActiveOffers = async (req, res) => {
  try {
    const offers = await RideOffers.getActiveOffers(req.user.id);
    res.json(offers);
  } catch (err) {
    console.error("getActiveOffers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Create Offer (Driver Proposes Custom Fare) ──────────────────────────────

exports.createOffer = async (req, res) => {
  const { passenger_id, pickup_address, dropoff_address, offered_fare, slot_sub_slot_id } = req.body;

  if (!passenger_id || !pickup_address || !dropoff_address || !offered_fare) {
    return res.status(400).json({ message: "passenger_id, pickup_address, dropoff_address, and offered_fare are required" });
  }

  try {
    // Create offer with 1 hour expiration
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    const result = await RideOffers.createOffer({
      driver_id: req.user.id,
      passenger_id,
      pickup_address,
      dropoff_address,
      estimated_km: 0, // Could be calculated if coordinates provided
      offered_fare,
      slot_sub_slot_id,
      expires_at: expiresAt
    });

    res.status(201).json({
      message: "Offer created",
      offerId: result.insertId
    });
  } catch (err) {
    console.error("createOffer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Start Driving (Mark Ride as In Progress) ────────────────────────────────

exports.startDriving = async (req, res) => {
  const { bookingId } = req.params;
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: "latitude and longitude are required" });
  }

  try {
    const booking = await Booking.getBookingById(bookingId);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking[0].driver_id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update booking status to in_progress and store driver location
    await db.query(
      `UPDATE bookings SET status = 'in_progress', driver_location_lat = ?, driver_location_lon = ? WHERE id = ?`,
      [latitude, longitude, bookingId]
    );

    res.json({ message: "Ride started" });
  } catch (err) {
    console.error("startDriving error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Done Driving (Complete Ride and Free Slot) ──────────────────────────────

exports.doneDriving = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const bookingRows = await Booking.getBookingById(bookingId);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingRows[0];
    if (booking.driver_id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mark booking as completed
    await db.query(
      `UPDATE bookings SET status = 'completed', is_completed_by_driver = TRUE WHERE id = ?`,
      [bookingId]
    );

    // Free the sub-slot
    if (booking.sub_slot_id) {
      await Slot.markSubSlotAvailable(booking.sub_slot_id);
    }

    res.json({ message: "Ride completed and slot freed" });
  } catch (err) {
    console.error("doneDriving error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Update Driver Location During Ride ──────────────────────────────────────

exports.updateLocation = async (req, res) => {
  const { bookingId } = req.params;
  const { latitude, longitude, timestamp } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: "latitude and longitude are required" });
  }

  try {
    const bookingRows = await Booking.getBookingById(bookingId);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingRows[0];
    if (booking.driver_id != req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update driver location
    await db.query(
      `UPDATE bookings SET driver_location_lat = ?, driver_location_lon = ? WHERE id = ?`,
      [latitude, longitude, bookingId]
    );

    res.json({ message: "Location updated" });
  } catch (err) {
    console.error("updateLocation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
