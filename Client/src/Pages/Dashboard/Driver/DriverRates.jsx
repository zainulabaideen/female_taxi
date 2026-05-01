import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { driverAPI } from "../../../services/api";

const DriverRates = () => {
  const [rates, setRates] = useState({ per_km_charge: 0, base_fare: 0 });
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newDiscount, setNewDiscount] = useState({
    discount_type: "percentage",
    discount_value: 0,
    min_km: 0,
    max_km: 10000
  });

  useEffect(() => {
    fetchRatesAndDiscounts();
  }, []);

  const fetchRatesAndDiscounts = async () => {
    try {
      setLoading(true);
      const [ratesRes, discountsRes] = await Promise.all([
        driverAPI.getRates(),
        driverAPI.getDiscounts()
      ]);

      if (ratesRes.data) {
        setRates({
          per_km_charge: ratesRes.data.per_km_charge || 0,
          base_fare: ratesRes.data.base_fare || 0
        });
      }

      setDiscounts(discountsRes.data || []);
    } catch (err) {
      toast.error("Failed to load rates");
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (field, value) => {
    setRates(p => ({ ...p, [field]: parseFloat(value) || 0 }));
  };

  const handleSaveRates = async () => {
    setSaving(true);
    try {
      await driverAPI.setRates(rates);
      toast.success("Rates updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save rates");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDiscount = async () => {
    if (newDiscount.discount_value <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    try {
      setSaving(true);
      await driverAPI.addDiscount(newDiscount);
      toast.success("Discount added!");
      setNewDiscount({ discount_type: "percentage", discount_value: 0, min_km: 0, max_km: 10000 });
      await fetchRatesAndDiscounts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add discount");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDiscount = async (discountId) => {
    try {
      await driverAPI.removeDiscount(discountId);
      toast.success("Discount removed!");
      setDiscounts(discounts.filter(d => d.id !== discountId));
    } catch (err) {
      toast.error("Failed to remove discount");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[#402763] mb-1">Pricing & Rates</h1>
        <p className="text-[#402763]/60 text-sm">Set your per-kilometer charges and manage discounts</p>
      </div>

      {/* Rates Section */}
      <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
        <h3 className="text-lg font-bold text-[#402763] mb-6 flex items-center gap-2">
          <DollarSign size={20} className="text-[#ffcd60]" /> Pricing Rates
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">
              Base Fare (Rs.)
            </label>
            <input
              type="number"
              value={rates.base_fare}
              onChange={(e) => handleRateChange("base_fare", e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
            <p className="text-xs text-[#402763]/50 mt-1">Fixed amount per ride</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">
              Per Kilometer Rate (Rs./km)
            </label>
            <input
              type="number"
              value={rates.per_km_charge}
              onChange={(e) => handleRateChange("per_km_charge", e.target.value)}
              placeholder="20"
              step="0.5"
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            />
            <p className="text-xs text-[#402763]/50 mt-1">Charged per kilometer traveled</p>
          </div>

          <div className="bg-[#ede0f2] rounded-xl p-4">
            <p className="text-sm text-[#402763]/60 mb-3">Fare Calculation Example:</p>
            <p className="text-sm text-[#402763] font-mono">
              Fare = {rates.base_fare} + (distance × {rates.per_km_charge})
            </p>
            <p className="text-xs text-[#402763]/50 mt-2">
              Example: For a 10 km ride: Rs. {(rates.base_fare + 10 * rates.per_km_charge).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleSaveRates}
            disabled={saving}
            className="w-full px-6 py-3 bg-[#402763] text-white font-bold rounded-xl hover:bg-[#402763]/90 transition text-sm flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Rates"
            )}
          </button>
        </div>
      </div>

      {/* Discounts Section */}
      <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
        <h3 className="text-lg font-bold text-[#402763] mb-6 flex items-center gap-2">
          <Plus size={20} className="text-[#ffcd60]" /> Manage Discounts
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#402763] mb-2">
              Discount Type
            </label>
            <select
              value={newDiscount.discount_type}
              onChange={(e) => setNewDiscount(p => ({ ...p, discount_type: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (Rs.)</option>
              <option value="free">Free Trip</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">
                {newDiscount.discount_type === "percentage" ? "Discount (%)" : "Discount Amount (Rs.)"}
              </label>
              <input
                type="number"
                value={newDiscount.discount_value}
                onChange={(e) => setNewDiscount(p => ({ ...p, discount_value: parseFloat(e.target.value) || 0 }))}
                placeholder={newDiscount.discount_type === "percentage" ? "15" : "50"}
                step={newDiscount.discount_type === "percentage" ? "1" : "10"}
                className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">
                Min Kilometers
              </label>
              <input
                type="number"
                value={newDiscount.min_km}
                onChange={(e) => setNewDiscount(p => ({ ...p, min_km: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#402763] mb-2">
                Max Kilometers
              </label>
              <input
                type="number"
                value={newDiscount.max_km}
                onChange={(e) => setNewDiscount(p => ({ ...p, max_km: parseInt(e.target.value) || 10000 }))}
                placeholder="10000"
                className="w-full px-4 py-3 rounded-xl border border-[#e1cfe6] text-[#402763] focus:border-[#402763] focus:ring-2 focus:ring-[#402763]/10 transition text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleAddDiscount}
            disabled={saving}
            className="w-full px-6 py-3 bg-[#ffcd60] text-[#402763] font-bold rounded-xl hover:bg-[#ffcd60]/90 transition text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Discount
          </button>
        </div>
      </div>

      {/* Active Discounts */}
      {discounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e1cfe6] p-6">
          <h3 className="text-lg font-bold text-[#402763] mb-4">Active Discounts</h3>
          <div className="space-y-3">
            {discounts.map((discount) => (
              <div key={discount.id} className="flex items-center justify-between bg-[#ede0f2] rounded-lg p-4">
                <div className="flex-1">
                  <p className="font-semibold text-[#402763]">
                    {discount.discount_type === "percentage"
                      ? `${discount.discount_value}% Off`
                      : discount.discount_type === "fixed"
                        ? `Rs. ${discount.discount_value} Off`
                        : "Free Trip"}
                  </p>
                  <p className="text-xs text-[#402763]/60">
                    {discount.min_km}km - {discount.max_km}km
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteDiscount(discount.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRates;
