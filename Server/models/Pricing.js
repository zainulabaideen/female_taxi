const db = require("../config/db");

// ─── Driver Rates ─────────────────────────────────────────────────────────────

exports.getDriverRates = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT * FROM driver_rates WHERE driver_id = ?`,
    [driver_id]
  );
  return rows.length > 0 ? rows[0] : null;
};

exports.setDriverRates = async (driver_id, { per_km_charge, base_fare, surge_multiplier }) => {
  const existing = await exports.getDriverRates(driver_id);

  if (existing) {
    const [result] = await db.query(
      `UPDATE driver_rates SET per_km_charge = ?, base_fare = ?, surge_multiplier = ?, updated_at = CURRENT_TIMESTAMP WHERE driver_id = ?`,
      [per_km_charge, base_fare, surge_multiplier, driver_id]
    );
    return result;
  } else {
    const [result] = await db.query(
      `INSERT INTO driver_rates (driver_id, per_km_charge, base_fare, surge_multiplier) VALUES (?, ?, ?, ?)`,
      [driver_id, per_km_charge, base_fare, surge_multiplier]
    );
    return result;
  }
};

// ─── Driver Discounts ─────────────────────────────────────────────────────────

exports.getDriverDiscounts = async (driver_id) => {
  const [rows] = await db.query(
    `SELECT * FROM driver_discounts WHERE driver_id = ? AND is_active = TRUE ORDER BY created_at DESC`,
    [driver_id]
  );
  return rows;
};

exports.addDiscount = async (driver_id, { discount_type, discount_value, min_km, max_km }) => {
  const [result] = await db.query(
    `INSERT INTO driver_discounts (driver_id, discount_type, discount_value, min_km, max_km)
     VALUES (?, ?, ?, ?, ?)`,
    [driver_id, discount_type, discount_value, min_km, max_km]
  );
  return result;
};

exports.removeDiscount = async (discount_id, driver_id) => {
  const [result] = await db.query(
    `DELETE FROM driver_discounts WHERE id = ? AND driver_id = ?`,
    [discount_id, driver_id]
  );
  return result;
};

// ─── Calculate Applicable Discounts ───────────────────────────────────────────

exports.calculateDiscount = async (driver_id, distance_km) => {
  const discounts = await exports.getDriverDiscounts(driver_id);

  let totalDiscount = 0;
  let discountBreakdown = [];

  for (const discount of discounts) {
    if (distance_km >= discount.min_km && distance_km <= discount.max_km) {
      discountBreakdown.push(discount);

      if (discount.discount_type === 'percentage') {
        totalDiscount += discount.discount_value;
      } else if (discount.discount_type === 'fixed') {
        totalDiscount += discount.discount_value;
      } else if (discount.discount_type === 'free') {
        // Free trip - handled specially
        return { isFree: true, discountAmount: null, breakdown: [discount] };
      }
    }
  }

  return {
    isFree: false,
    discountAmount: totalDiscount,
    breakdown: discountBreakdown
  };
};

// ─── Calculate Fare ───────────────────────────────────────────────────────────

exports.calculateFare = async (driver_id, distance_km) => {
  const rates = await exports.getDriverRates(driver_id);

  if (!rates) {
    return {
      base_fare: 0,
      per_km_charge: 0,
      km_cost: 0,
      subtotal: 0,
      discount_info: { isFree: false, discountAmount: 0 },
      total_fare: 0
    };
  }

  const kmCost = distance_km * rates.per_km_charge;
  const subtotal = rates.base_fare + kmCost;

  const discountInfo = await exports.calculateDiscount(driver_id, distance_km);

  let totalFare = subtotal;
  let discountAmount = 0;

  if (discountInfo.isFree) {
    totalFare = 0;
    discountAmount = subtotal;
  } else if (discountInfo.breakdown.length > 0) {
    const discount = discountInfo.breakdown[0]; // Apply first matching discount
    if (discount.discount_type === 'percentage') {
      discountAmount = (subtotal * discount.discount_value) / 100;
    } else if (discount.discount_type === 'fixed') {
      discountAmount = discount.discount_value;
    }
    totalFare = Math.max(0, subtotal - discountAmount);
  }

  return {
    base_fare: rates.base_fare,
    per_km_charge: rates.per_km_charge,
    km_cost: kmCost,
    subtotal,
    discount_info: discountInfo,
    discount_amount: discountAmount,
    total_fare: totalFare,
    surge_multiplier: rates.surge_multiplier
  };
};
