// Google Maps utility functions
export const initGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return apiKey;
};

export const loadGoogleMapsScript = async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (window.google) return window.google;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.body.appendChild(script);
  });
};

export const calculateFareEstimate = (distanceKm, basefare, perKmRate, discounts = 0) => {
  const kmCost = distanceKm * perKmRate;
  const subtotal = basefare + kmCost;
  const discountAmount = (subtotal * discounts) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  return {
    basefare,
    kmCost,
    subtotal,
    discountAmount,
    total
  };
};

export const formatLocation = (lat, lon) => {
  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
};

export const distanceBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export const getDirectionsPolyline = async (pickupLat, pickupLon, dropoffLat, dropoffLon) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLat},${pickupLon}&destination=${dropoffLat},${dropoffLon}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === 'OK' && data.routes.length > 0) {
      return data.routes[0].overview_polyline.points;
    }
    return null;
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
};
